import dlib
import torch
import cv2 as cv2
import numpy as np
import tensorflow as tf
from numpy import asarray
import face_detection as fd
from numpy import expand_dims
from config_service import ConfigService
from detectors.object_detection import ObjectDetection
from tensorflow.python.keras.models import load_model
from utils import crop_person_from_frame
import os

# import warnings
# warnings.simplefilter(action='ignore', category=FutureWarning)
physical_devices = tf.config.list_physical_devices('GPU')
#tf.config.experimental.set_memory_growth(physical_devices[0], True)

class FaceDetection:

    def __init__(self):
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(device)
        self.detector = fd.build_detector("DSFDDetector", confidence_threshold=0.1, max_resolution=320, device=device)
        self.model = load_model("models/facenet_keras.h5", compile=False)
        self.object_detection = ObjectDetection()
        self.counter = 0

    # Returns an array of bounding boxes of human faces in a image
    def get_face_locations(self, rgb_small_frame, confidence_threshold: float = 0.95):

        face_locations = []
        image_height, image_width = rgb_small_frame.shape[:2]

        boxes = self.detector.detect(rgb_small_frame)

        if boxes is None:
            return face_locations

        # Our next step is to loop over all the co-ordinates it returned and draw rectangles around them using Open CV.
        # We will be drawing a green rectangle with thicknes
        for item in boxes:

            score =  item[4]

            print(score)

            # filter out weak detections by ensuring the `confidence` is greater than the minimum confidence
            if score >= confidence_threshold: 

                x1, y1, x2, y2 = item[:4]

                if(x1 > 0 and x2 > 0 and y1 > 0 and y2 > 0):

                    # compute the (x, y)-coordinates of the bounding box for the object
                    face_locations.append([item[:4], score])

        return face_locations

    # Given an face image, return the 128-dimension face encoding
    def get_face_encodings(self, rgb_small_frame, box):

        x1, y1, x2, y2 = box

        face = rgb_small_frame[int(y1):int(y2), int(x1):int(x2)]

        if(face.shape[0] <= 0 or face.shape[1] <= 0):
            return None

        face = cv2.resize(face, dsize=(160, 160), interpolation=cv2.INTER_CUBIC)

        face_pixels = asarray(face)

        # scale pixel values
        face_pixels = face_pixels.astype('float32')
        # standardize pixel values across channels (global)
        mean, std = face_pixels.mean(), face_pixels.std()
        face_pixels = (face_pixels - mean) / std
        # transform face into one sample
        samples = expand_dims(face_pixels, axis=0)
        # make prediction to get embedding
        yhat = self.model(samples)
        return yhat[0]

    def detect_faces(self, small_frame, path, confidence_threshold=0.95):

        # Find all the faces and face encodings in the current image
        face_locations = self.get_face_locations(small_frame, confidence_threshold)

        faces = []

        for face_location in face_locations:

            face_encoding = self.get_face_encodings(small_frame, face_location[0])

            if face_encoding is None:
                continue

            face = {
                "face_encoding": face_encoding,
                "face_location": face_location[0],
                "image_path": path,
                "accuracy": face_location[1]
            }

            # Grab a single frame of video
            faces.append(face)

        return faces

    def draw_faces(self, image, face):

        x1, y1, x2, y2 = face["face_location"]
        cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)),(0, 255, 0), 2)

    def get_faces_from_video(self, video_path):
        
        vs = cv2.VideoCapture(video_path)
        faces = []

        # Loop Video Stream
        while True:

            (grabbed, frame) = vs.read()

            if frame is None:
                break

            small_frame = frame

            temp = self.detect_faces(small_frame, video_path, ConfigService.face_detection_threshold())
            for face in temp:
                self.counter += 1
                self.save_face_image(face, small_frame)
            faces.extend(temp)

            small_frame = cv2.resize(small_frame,(300,300))
            cv2.imshow("camera", small_frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('q'):
                break

        cv2.destroyWindow("camera")
        return faces

    def save_face_image(self, face, human):
        save_path = "faces/clustering"
        file_name = "{}.png".format(self.counter)
        self.counter += 1
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        completeName = os.path.join(save_path, file_name)

        (x, y, x1, y1) = [int(v) for v in face["face_location"]]
        cropped = human[y:y1,x:x1]
        print(cropped.shape)
        cropped = cv2.resize(cropped, dsize=(160, 160), interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(completeName,cropped)