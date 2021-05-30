from detection_dto import DetectionDto
import numpy as np

class FaceDetectionDto(DetectionDto):

    def __init__(self, contextId, detection_time, detection_type, description, accuracy, face_location, face_id, face_encoding_vector):
        super().__init__(contextId, detection_time, detection_type, description, accuracy)
        self.FaceLocation = face_location.tolist()
        self.FaceID = str(face_id)
        self.FaceEmbeddingVector = np.array(face_encoding_vector).tolist()