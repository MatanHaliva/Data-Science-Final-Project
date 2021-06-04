import threading
from anomaly_detection_dto import AnomalyDetectionDto
from anomaly_detection import AnomalyDetection
from detection_api_connector import DetectionApiConnector
from config_service import ConfigService
from detection_type_enum import DetectionType
import os

class ProcessAnomaly(threading.Thread):
    def __init__(self, video_path, context_id):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.anomaly_detection: AnomalyDetection = AnomalyDetection()
        self.processing_percents = 0
        print("init", context_id)

    def run(self):
        self.detect_anomaly()

    def detect_anomaly(self):
        for detection in self.anomaly_detection.detect_anomaly(self.video_path)["anomaly"]:
            message: AnomalyDetectionDto = AnomalyDetectionDto(1, detection[1],
                                                       DetectionType.Anomaly.value, "Anomaly was detected",
                                                       detection[0], ConfigService.anomaly_detection_ranges(detection[2]))
            DetectionApiConnector.create_detection(message)

    def calc_processing_percents(self):
        batches = self.anomaly_detection.total_frames / self.anomaly_detection.sample_size
        batch_precent = 100 / batches
        self.processing_percents =  100 - (len(list(filter(lambda x: ".npy" in x, os.listdir(self.anomaly_detection.cache_dir)))) * batch_precent)

