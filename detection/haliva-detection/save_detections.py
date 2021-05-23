import requests
from detection_dto import DetectionDto

class SaveDetections:

    @staticmethod
    def save(detection: DetectionDto):
        url = 'https://www.service.com'
        print(url)
        myobj = detection.tojson()
        print(myobj)
        # x = requests.post(url, data = myobj)
        # print(x.text)