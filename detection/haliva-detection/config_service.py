import requests
from detection_dto import DetectionDto

class ConfigService:

    @staticmethod
    def draw_detections_enabled():
        return True

    @staticmethod
    def save_thumbnail_of_faces_enabled():
        return True

    @staticmethod
    def detection_api_create_faces_url():
        return "https://detections-api.azurewebsites.net/Detections/CreateFaces"

    @staticmethod
    def detection_api_create_masks_url():
        return "https://detections-api.azurewebsites.net/Detections/CreateMasks"

    @staticmethod
    def detection_api_create_anomaly_url():
        return "https://detections-api.azurewebsites.net/Detections/CreateAnomaly"

    @staticmethod
    def object_detection_threshold():
        return 0.8

    @staticmethod
    def face_detection_threshold():
        return 0.95
    
    @staticmethod
    def mask_detection_threshold():
        return 0.95
    
    @staticmethod
    def detection_api_enabled():
        return False

    @staticmethod
    def anomaly_detection_ranges(value):
        if 0.98 < value <= 1:
            return "LOW"

        if 0.9 < value <= 0.95:
            return "HIGH"

        if 0 < value <= 0.9:
            return "FATAL"
    @staticmethod        
    def save_to_mp4_enabled():
        return True
    
