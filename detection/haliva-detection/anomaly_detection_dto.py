from detection_dto import DetectionDto


class AnomalyDetectionDto(DetectionDto):

    def __init__(self, contextId, detection_time, detection_type, description, accuracy, severity):
        super().__init__(contextId, detection_time, detection_type, description, accuracy)
        self.AnomalySeverity = severity
