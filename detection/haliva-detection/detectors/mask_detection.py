import cv2 as cv2
import numpy as np
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model

class MaskDetection:

    def __init__(self):
        self.net = load_model("models/mask_detector.model")

    def detect_mask(self, frame, face):

        (h, w) = frame.shape[:2]

        (startX, startY, endX, endY) = [int(v) for v in face["face_location"]]

        faceImage = frame[startY:endY, startX:endX]
        faceImage = cv2.cvtColor(faceImage, cv2.COLOR_BGR2RGB)
        faceImage = cv2.resize(faceImage, (224, 224))
        faceImage = img_to_array(faceImage)
        faceImage = preprocess_input(faceImage)
        faces = [faceImage]
        faces = np.array(faces, dtype="float32")
        preds = self.net.predict(faces, batch_size=32)
        return preds[0]
