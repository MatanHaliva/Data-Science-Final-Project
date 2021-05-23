import threading
import time

import cv2 as cv2
from face_detection import FaceDetection
from face_clustering import FaceClustering
from object_detection import ObjectDetection
from detection_dto import DetectionDto
from face_detection_dto import FaceDetectionDto
from mask_detection_dto import MaskDetectionDto
from mask_detection import MaskDetection
from save_detections import SaveDetections


class Process(threading.Thread):
    def __init__(self, video_path, context_id):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.object_detection = ObjectDetection()
        self.face_detection = FaceDetection()
        self.face_clustering = FaceClustering()
        self.mask_detection = MaskDetection()
        self.processing_percents = 0
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
            temp = self.face_detection.detect_faces(frame, str(self.context_id), 0.95)
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

            print("test loop", self.context_id)
            milliseconds = vs.get(cv2.CAP_PROP_POS_MSEC)
            detection_time = self.get_detection_time(milliseconds)

            if frame is None:
                break

            image = frame.copy()

            detections = self.object_detection.detect_objects(image)

            for detection in detections:

                name_of_class_id = self.object_detection.get_name_of_class_id(detection["class_id"])
                self.object_detection.draw_prediction(image, detection)

                if name_of_class_id == "person":
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
        faces = self.face_detection.detect_faces(human, self.context_id, 0.2)

        for face in faces:

            face_id = self.face_detection.get_person_id(face_encodings, face["face_encoding"], pca_df_all_data)
            face_id = 0

            (mask, withoutMask) = self.mask_detection.detect_mask(human, face)
            with_Mask: bool =  mask > withoutMask

            if with_Mask:
                message: FaceDetectionDto = MaskDetectionDto(self.context_id, detection_time , "MasKDetection" ,"mask was detected", detection["confidence"], face["face_location"], face_id, face["face_encoding"], with_Mask)
            else:
                message: FaceDetectionDto = FaceDetectionDto(self.context_id, detection_time , "FaceDetection" ,"face was detected", detection["confidence"], face["face_location"], face_id, face["face_encoding"])

            SaveDetections.save(message)
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
