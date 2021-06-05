from dtos.anomaly_detection_dto import AnomalyDetectionDto
from detectors.anomaly_detection import AnomalyDetection
from detection_api_connector import DetectionApiConnector
from config_service import ConfigService
from dtos.detection_type_enum import DetectionType
from process import Process


class ProcessAnomaly(Process):
    def __init__(self, video_path, context_id):
        super().__init__(video_path, context_id)
        self.anomaly_detection: AnomalyDetection = AnomalyDetection()
        self.processing_percents = self.anomaly_detection.done_tasks


    def run(self):
        print("started anomally")
        self.detect_anomaly()


    @property
    def processing_percents(self):
        # print("Getting value...")
        batches = self.anomaly_detection.total_frames / self.anomaly_detection.sample_size
        batch_precent = 100 / batches
        return self._processing_percents[0] * batch_precent

    @processing_percents.setter
    def processing_percents(self, value):
        # print("set value...")
        self._processing_percents = value


    def detect_anomaly(self):
        for detection in self.anomaly_detection.detect_anomaly(self.video_path)["anomaly"]:
            message: AnomalyDetectionDto = AnomalyDetectionDto(1, detection[1],
                                                               DetectionType.Anomaly.value, "Anomaly was detected",
                                                               detection[0],
                                                               ConfigService.anomaly_detection_ranges(detection[2]))
            DetectionApiConnector.create_detection(message)



