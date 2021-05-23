from detection_dto import DetectionDto

class FaceDetectionDto(DetectionDto):

    def __init__(self, contextId, detection_time, detection_type, description, accuracy, face_location, face_id, face_encoding_vector):
        super().__init__(contextId, detection_time, detection_type, description, accuracy)
        self.FaceLocation = face_location
        self.FaceID = face_id
        self.FaceEmbeddingVector = face_encoding_vector