from face_detection_dto import FaceDetectionDto

class MaskDetectionDto(FaceDetectionDto):

    def __init__(self, contextId, detection_time, detection_type, description, accuracy, face_location, face_id, face_encoding_vector, with_mask):
        super().__init__(contextId, detection_time, detection_type, description, accuracy, face_location, face_id, face_encoding_vector)
        self.WithMask = with_mask