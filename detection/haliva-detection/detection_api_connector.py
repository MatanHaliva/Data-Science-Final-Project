import requests
from detection_dto import DetectionDto
from config_service import ConfigService
import numpy as np
from detection_type_enum import DetectionType

class DetectionApiConnector:

    @staticmethod
    def create_detection(detection: DetectionDto):

        if(ConfigService.detection_api_enabled() == False):
            return

        url = None
        if(detection.DetectionType == DetectionType.Mask.value):
            url = ConfigService.detection_api_create_masks_url()
        
        if(detection.DetectionType == DetectionType.Face.value):
            url = ConfigService.detection_api_create_faces_url()

        if(detection.DetectionType == DetectionType.Anomaly.value):
            url = ConfigService.detection_api_create_anomaly_url()

        myobj = np.array([detection.tojson()]).tolist()
        response = requests.post(url, json = myobj, verify=True)