import threading
import time
import os
import cv2 as cv2
from face_detection import FaceDetection
import time
from object_detection import ObjectDetection
from detection_dto import DetectionDto
from face_detection_dto import FaceDetectionDto
from mask_detection_dto import MaskDetectionDto
from mask_detection import MaskDetection
from detection_api_connector import DetectionApiConnector
from config_service import ConfigService
from detection_type_enum import DetectionType
import numpy as np

class Process(threading.Thread):
    def __init__(self, video_path, context_id, face_clustering):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.object_detection = ObjectDetection()
        self.face_detection = FaceDetection()
        self.face_clustering = face_clustering
        self.mask_detection = MaskDetection()
        self.processing_percents = 0
        self.counter = 0
        print("init", context_id)

    def cluster_faces_from_video(self):

        print("start train", self.context_id)
        vs = cv2.VideoCapture(self.video_path)
        faces = []

        # Loop Video Stream
        while True:

            (grabbed, frame) = vs.read()

            if frame is None:
                break

            # Step 2: Calculate the embedding vector for every face
            temp = self.face_detection.detect_faces(frame, str(self.context_id), ConfigService.face_detection_threshold())
            faces.extend(temp)

            frame = cv2.resize(frame, (300, 300))
            cv2.imshow("camera" + str(self.context_id), frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                break

        cv2.destroyWindow("camera" + str(self.context_id))

        if(len(faces) > 0):
            pca_df_all_data, pca_df, dbscan_sil_score, face_encodings = self.face_clustering.start(faces)
            print("finish train", self.context_id)
            return face_encodings, pca_df_all_data

        return None, None

    def get_detection_time(self, milliseconds):
        seconds = milliseconds / 1000.0
        return seconds

    def start_detection(self, face_encodings, pca_df_all_data):

        print("start test", self.context_id)
        vs = cv2.VideoCapture(self.video_path)

        # Loop Video Stream
        while True:

            (grabbed, frame) = vs.read()

            milliseconds = vs.get(cv2.CAP_PROP_POS_MSEC)
            detection_time = self.get_detection_time(milliseconds)

            if frame is None:
                break

            image = frame.copy()

            detections = self.object_detection.detect_objects(image, ConfigService.object_detection_threshold())

            for detection in detections:

                name_of_class_id = self.object_detection.get_name_of_class_id(detection["class_id"])

                if name_of_class_id == "person":
                    if(ConfigService.draw_detections_enabled()):
                        self.object_detection.draw_prediction(image, detection)
                    self.detect_extra_info_about_person(image, detection, face_encodings, pca_df_all_data, detection_time)
                else :
                    message: DetectionDto = DetectionDto(self.context_id, detection_time , name_of_class_id,"{} was detected".format(name_of_class_id), detection["confidence"])
                    # SaveDetections.save(message)

            image = cv2.resize(image, (700, 700))
            cv2.imshow("camera" + str(self.context_id), image)

            self.calc_processing_percents(vs)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                break

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
        face_encodings, pca_df_all_data = self.cluster_faces_from_video()
        self.start_detection(face_encodings, pca_df_all_data) 

    def detect_extra_info_about_person(self, frame, detection, face_encodings, pca_df_all_data, detection_time):

        human = None

        try: 
            # Crop person from image
            human = self.crop_person_from_frame(frame, detection)

        except Exception:
            return

        # detect_faces
        faces = self.face_detection.detect_faces(human, self.context_id, ConfigService.face_detection_threshold())

        for face in faces:

            face_id = self.face_detection.get_person_id(face_encodings, face["face_encoding"], pca_df_all_data)
            
            if(ConfigService.save_thumbnail_of_faces_enabled()):
                self.save_face_image(face_id, face, human)

            (mask, withoutMask) = self.mask_detection.detect_mask(human, face)
            with_Mask =  mask > withoutMask

            message:FaceDetectionDto = FaceDetectionDto(self.context_id, detection_time , DetectionType.Face.value ,"face was detected", detection["confidence"], face["face_location"],  face_id["cluster"], face["face_encoding"])
            DetectionApiConnector.create_detection(message)

            if with_Mask:
                if(mask >= ConfigService.mask_detection_threshold()):
                    message:MaskDetectionDto = MaskDetectionDto(self.context_id, detection_time , DetectionType.Mask.value ,"mask was detected", np.float64(mask), True)
                    DetectionApiConnector.create_detection(message)
            
            

            # print(message)

    def crop_person_from_frame(self, frame, detection):
        box = detection["location"]
        x = int(box[0])
        y = int(box[1])
        w = int(box[2])
        h = int(box[3])
        x_plus_w = int(x+w)
        y_plus_h = int(y+h)

        if(x > 0 and y > 0):
            # Crop person from image
            human = frame[y:y_plus_h, x:x_plus_w]
            return human
        else:
            raise Exception("wrong person") 

    def save_face_image(self, face_id, face, human):
        save_path = "faces\context_id_{}\{}".format(self.context_id, face_id["cluster"])
        file_name = "{}.png".format(self.counter)
        self.counter += 1
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        completeName = os.path.join(save_path, file_name)

        (x, y, x1, y1) = [v for v in face["face_location"]]
        cropped = human[y:y1,x:x1]
        cropped = cv2.resize(cropped, dsize=(160, 160), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(completeName,cropped)