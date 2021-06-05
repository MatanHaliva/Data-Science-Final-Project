import threading
import time
import os
import cv2 as cv2
from detectors.face_detector import FaceDetection
import time
from detectors.object_detection import ObjectDetection
from dtos.detection_dto import DetectionDto
from dtos.face_detection_dto import FaceDetectionDto
from dtos.mask_detection_dto import MaskDetectionDto
from detectors.mask_detection import MaskDetection
from detection_api_connector import DetectionApiConnector
from config_service import ConfigService
from dtos.detection_type_enum import DetectionType
import numpy as np
from utils import crop_person_from_frame

class Process(threading.Thread):
    
    def __init__(self, video_path, context_id, face_clustering, face_detection):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.object_detection = ObjectDetection()
        self.face_detection = face_detection
        self.face_clustering = face_clustering
        self.mask_detection = MaskDetection()
        self.processing_percents = 0
        self.video_writer = None
        print("init", context_id)

    def get_detection_time(self, milliseconds):
        seconds = milliseconds / 1000.0
        return seconds

    def start_detection(self):

        print("start test", self.context_id)
        vs = cv2.VideoCapture(self.video_path)

        # Loop Video Stream
        while True:

            (grabbed, frame) = vs.read()

            milliseconds = vs.get(cv2.CAP_PROP_POS_MSEC)
            detection_time = self.get_detection_time(milliseconds)

            if frame is None:
                break

            image = cv2.resize(frame, (0, 0),  fx=0.3, fy=0.3)

            detections = self.object_detection.detect_objects(image, ConfigService.object_detection_threshold())

            for detection in detections:
              
                name_of_class_id = self.object_detection.get_name_of_class_id(detection["class_id"])

                if name_of_class_id == "person":
                    self.detect_extra_info_about_person(image, detection, detection_time)
                else :
                    message: DetectionDto = DetectionDto(self.context_id, detection_time , name_of_class_id,"{} was detected".format(name_of_class_id), detection["confidence"])
                    # SaveDetections.save(message)

                if name_of_class_id == "person" or name_of_class_id == "car":
                    if(ConfigService.draw_detections_enabled()):
                        self.object_detection.draw_prediction(image, detection)

            image = cv2.resize(image, (640,480))

            if ConfigService.save_to_mp4_enabled():
                self.save_to_mp4_file(image)

            cv2.imshow("camera" + str(self.context_id), image)

            self.calc_processing_percents(vs)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                break

        if(self.video_writer != None):
            self.video_writer.release()

        cv2.destroyWindow("camera" + str(self.context_id))

        print("finish test", self.context_id)

    def calc_processing_percents(self, video_capture):
        
        # get next frame number out of all the frames for video
        next_frame_no = video_capture.get(cv2.CAP_PROP_POS_FRAMES)
        # get total number of frames in the video
        total_frames = video_capture.get(cv2.CAP_PROP_FRAME_COUNT)

        complete = round(next_frame_no/total_frames, 4)

        self.processing_percents = format(complete * 100, ".2f")

        print(self.processing_percents, "%")

    def run(self):
        self.start_detection() 

    def detect_extra_info_about_person(self, frame, detection, detection_time):

        human = None

        try: 
            # Crop person from image
            human = crop_person_from_frame(frame, detection)

        except Exception:
            return

        # detect_faces
        faces = self.face_detection.detect_faces(human, self.context_id, ConfigService.face_detection_threshold())

        for face in faces:

            face_id = self.face_clustering.get_person_id(face["face_encoding"])

            message:FaceDetectionDto = FaceDetectionDto(self.context_id, detection_time , DetectionType.Face.value ,"face was detected", detection["confidence"], face["face_location"],  face_id, face["face_encoding"])
            detection_id = DetectionApiConnector.create_detection(message)
            
            if(ConfigService.save_thumbnail_of_faces_enabled()):
                self.save_face_image(face_id, face, human, detection_id)
            
            if(ConfigService.draw_detections_enabled()):
                self.face_detection.draw_faces(human, face)

            (mask, withoutMask) = self.mask_detection.detect_mask(human, face)
            with_Mask =  mask > withoutMask

            if with_Mask:
                if(mask >= ConfigService.mask_detection_threshold()):
                    message:MaskDetectionDto = MaskDetectionDto(self.context_id, detection_time , DetectionType.Mask.value ,"mask was detected", np.float64(mask), True)
                    DetectionApiConnector.create_detection(message)
            
    def save_face_image(self, face_id, face, human, detection_id):
        save_path = "faces\context_id_{}\{}".format(self.context_id, face_id)
        file_name = "{}.png".format(detection_id)
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        completeName = os.path.join(save_path, file_name)

        (x, y, x1, y1) = [int(v) for v in face["face_location"]]
        cropped = human[y:y1,x:x1]
        cropped = cv2.resize(cropped, dsize=(160, 160), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(completeName,cropped)

    def save_to_mp4_file(self, frame):

        if(self.video_writer == None):
            fourcc = cv2.VideoWriter_fourcc(*'DIVX')
            save_path = "faces\context_id_{}".format(self.context_id)
            if not os.path.exists(save_path):
                os.makedirs(save_path)
            save_path += "\output.mp4"
            self.video_writer = cv2.VideoWriter(save_path,fourcc, 15.0,(640,480))
            print("video_writer")

        print("save_to_mp4_file")
        self.video_writer.write(frame)