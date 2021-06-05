from dtos.detection_dto import DetectionDto

class MaskDetectionDto(DetectionDto):

    def __init__(self, contextId, detection_time, detection_type, description, accuracy, with_mask):
        super().__init__(contextId, detection_time, detection_type, description, accuracy)
        self.WithMask = with_mask