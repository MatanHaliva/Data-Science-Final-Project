import cv2 as cv2
import numpy as np


class ObjectDetection:

    def __init__(self):
        config_file = "models/yolov4-tiny.cfg"
        weights_file = "models/yolov4-tiny.weights"
        self.net = cv2.dnn.readNetFromDarknet(config_file, weights_file)
        self.init_classes()

    def init_classes(self):
        self.classes = None
        classes_file = "models/yolov4-tiny.names"
        with open(classes_file, 'r') as f:
            self.classes = [line.strip() for line in f.readlines()]

        self.COLORS = np.random.uniform(0, 255, size=(len(self.classes), 3))
   
    def detect_objects(self, rgb_small_frame, confidence_threshold=0.5):

        objects = []
        scale = 0.00392
        image_height, image_width = rgb_small_frame.shape[:2]
        blob = cv2.dnn.blobFromImage(
            rgb_small_frame, scale, (416, 416), (0, 0, 0), True, crop=False)
        self.net.setInput(blob)
        outs = self.net.forward(self.get_output_layers(self.net))

        for out in outs:
            for detection in out:
                scores = detection[5:]
                class_id = np.argmax(scores)

                # extract the confidence (i.e., probability) associated with the prediction
                confidence = scores[class_id]

                # filter out weak detections by ensuring the `confidence` is greater than the minimum confidence
                if confidence > confidence_threshold:

                    # compute the (x, y)-coordinates of the bounding box for the object
                    center_x = int(detection[0] * image_width)
                    center_y = int(detection[1] * image_height)
                    w = int(detection[2] * image_width)
                    h = int(detection[3] * image_height)
                    x = center_x - w / 2
                    y = center_y - h / 2
                    box = [x, y, w, h]
                    objects.append({"class_id": class_id,"confidence": float(confidence), "location": box })

        return objects

    def get_output_layers(self, net):
        layer_names = self.net.getLayerNames()
        output_layers = [layer_names[i[0] - 1]
                         for i in net.getUnconnectedOutLayers()]
        return output_layers

    def draw_prediction(self, img, detection):

        class_id = detection["class_id"]
        box = detection["location"]
        x = round(box[0])
        y = round(box[1])
        w = round(box[2])
        h = round(box[3])
        x_plus_w = round(x+w)
        y_plus_h = round(y+h)

        label = str(self.classes[class_id])
        color = self.COLORS[class_id]
        cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), color, 2)
        cv2.putText(img, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    def get_name_of_class_id(self, class_id):
        return self.classes[class_id]
