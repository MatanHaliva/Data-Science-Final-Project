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
    