from requests.api import get
from config_service import ConfigService
import requests
from imgcompare import image_diff_percent
from PIL import Image
import numpy as np
import enum
import urllib
import json, ast

class DetectionType(enum.Enum):
    Car = 0
    Face = 1
    Mask = 2
    Motion = 3
    Anomaly = 4

class AggregationService():

    def __init__(self):
        self._processes = {}

    def create_groups_by_context_id(self, context_id):

        unsortedArray = self.get_detections(context_id)
        # unsortedArray = [{"Id": '2a709381-7140-43a3-8a17-b6e3e246cee8', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0, "Accuracy": 0.99, "LicensePlate": "32-3-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee8', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0.2, "Accuracy": 0.99, "LicensePlate": "32-3-3", "Manufacturer": "Honda", "Colors": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 0.3, "Accuracy": 0.99, "LicensePlate": "32-3-3", "Manufacturer": "Honda", "Colors": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee9', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0.6, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee9', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0.7, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee9', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0.8, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.1, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee10', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.2, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee9', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 1.3, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.4, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.5, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee9', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 1.6, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.7, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 1, "DetectionTime": 1.8, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"},
        #  {"Id": '2a709381-7140-43a3-8a17-b6e3e246cee7', "ContextId": '03297157-3f15-4763-981c-5e504e21dcaf', "Description": "hi", "DetectionType": 0, "DetectionTime": 0.19, "Accuracy": 0.99, "LicensePlate": "32-355-3", "Manufacturer": "Honda", "Color": "white"}]
        
        detections = sorted(unsortedArray, key=lambda detection: detection["DetectionTime"]) #orderByDetectionTime
        return self.create_aggregation(detections)

    def get_detections(self, context_id):

        url = "{}/{}".format(ConfigService.detection_api_get_detection_url(),context_id)
        response = requests.get(url)

        return ast.literal_eval(json.dumps(response.json()))

    def create_aggregation(self, detections):

        groups = []
        history = []
        counterGroups = 0

        time_range = 10
        start_time = 0
        end_time = start_time + time_range

        for i in range(0, len(detections)):

            current_detection = detections[i]
            print("start_time:", start_time, "current_detection_time:", current_detection["DetectionTime"], "end_time:", end_time)

            # check if we finished a time range (Note: the detections list must be sorted)
            if(current_detection["DetectionTime"] >= end_time): 
                
                self.add_groups_to_history(history, groups, start_time)
                groups = []
                start_time = end_time
                end_time = start_time + time_range

            if(len(groups) == 0):
                self.create_group(groups, counterGroups, current_detection)
                print("-----------------create_group-------------------")
                counterGroups = counterGroups + 1
                continue

            minIndex, minimum_distance = self.get_index_of_closest_group(groups, current_detection)

            if(minimum_distance >= ConfigService.threshold()):
                self.create_group(groups, counterGroups, current_detection)
                print("-----------------create_group-------------------")
                counterGroups = counterGroups + 1
            else: 
                self.add_detection_to_group(groups[minIndex], current_detection)
            
        self.add_groups_to_history(history, groups, start_time)
        
        return history

    def create_group(self, groups, id, last_detection):
        groups.append({
            "id": id,
            "last_detection": last_detection,
            "items": [last_detection],
        })

    def add_detection_to_group(self, group, detection):
        group["last_detection"] = detection
        items = group["items"]
        items.append(detection)
        group["items"] = items

    def add_groups_to_history(self, history, groups, start_time):
        temp = []
        for k in range(0, len(groups)):
            temp.append({"group_id": groups[k]["id"], "length": len(groups[k]["items"]), "last_detection": groups[k]["last_detection"]})
        history.append({"start_time": start_time, "groups": temp})

    def get_index_of_closest_group(self, groups, detection):
        distances = []

        for j in range(0, len(groups)):
            distances.append(self.calc_image_diff_percent(detection, groups[j]["last_detection"]))
        
        minIndex = distances.index(min(distances))
        return minIndex, distances[minIndex]

    def calc_image_diff_percent(self, detection, other_detection):

        url_Of_detection_image = self.get_url(detection)
        url_of_other_detection_image = self.get_url(other_detection)

        i1 = Image.open(requests.get(url_Of_detection_image, stream=True).raw)
        i2 = Image.open(requests.get(url_of_other_detection_image, stream=True).raw)

        i1 = i1.resize((256,256))
        i2 = i2.resize((256,256))

        percentage = image_diff_percent(i1, i2)

        print("detection_id: ", detection["Id"], "other_detection_id: ", other_detection["Id"], "percentage: ", percentage, "\n")

        return percentage

    def get_url(self, detection):
        
        url = None


        if (detection["DetectionType"] == DetectionType.Car.value):
            url = "{}/{}/{}/getImage".format(ConfigService.car_detection_api_url(), detection["ContextId"], detection["Id"])
        if(detection["DetectionType"] == DetectionType.Face.value):
            url = "{}/{}/{}/{}/getImage".format(ConfigService.face_detection_api_url(), detection["ContextId"],  detection["FaceId"] , detection["Id"])
        if(detection["DetectionType"] == DetectionType.Anomaly.value):
            url = "{}/static/warning.png".format(ConfigService.node_server_api_url)
     
        # url = "{}.jpg".format(detection["Id"])

        return url

