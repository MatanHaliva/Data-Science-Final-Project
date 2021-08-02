class ConfigService:

    @staticmethod
    def detection_api_get_detection_url():
        return "https://detections-api.azurewebsites.net/Detections/GetByType"
    
    @staticmethod
    def face_detection_api_url():
        return "http://localhost:5000/processes"
    
    @staticmethod
    def car_detection_api_url():
        return "http://localhost:5000/processes"

    @staticmethod
    def node_server_api_url():
        return "http://localhost:8000"
    
    @staticmethod
    def threshold():
        return 15




