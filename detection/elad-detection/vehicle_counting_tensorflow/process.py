import threading
import time
import requests

import json
import os
import random

import cv2 as cv
import numpy as np
import scipy.io
import subprocess
from subprocess import Popen
import json 

from utils_models import load_model

# Imports
import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import cv2
import numpy as np
import csv
import time
from packaging import version

from collections import defaultdict
from io import StringIO
from PIL import Image

# Object detection imports
from utils import label_map_util
from utils import visualization_utils as vis_util
from pathlib import Path


class Process(threading.Thread):
    def __init__(self, video_path, context_id):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.processing_percents = 0
        self.processing_path = 'Images/Processing/' + self.context_id
        self.images_path = self.processing_path + '/cars/{}'
        self.create_dir()
        print("init", context_id)

    def create_dir(self):
        Path(self.processing_path).mkdir(parents=True, exist_ok=True)
        Path(self.processing_path + '/cars/').mkdir(parents=True, exist_ok=True)


    def load_model_init(self):  
        model = load_model()
        model.load_weights('models/model.96-0.89.hdf5')

        cars_meta = scipy.io.loadmat('devkit/cars_meta')
        class_names = cars_meta['class_names']  # shape=(1, 196)
        class_names = np.transpose(class_names)
        
        return model, cars_meta, class_names

    def get_detection_time(self, milliseconds):
        seconds = milliseconds / 1000.0
        return seconds

    def create_detections(self, results):
        objects_detection_format = []

        for result in results:
            objects_detection_format.append({
                "ContextId": self.context_id,
                "DetectionType": 0,
                "DetectionTime": result["frame_number"],
                "Description": "car detection",
                "Accuracy": float(result["prob"]),
                "Color": result["detection_car"][0],
                "Manufacturer": result["label"],
                "LicensePlate": result["license_car"]
            })

        response = requests.post('https://detections-api.azurewebsites.net/Detections/CreateCars', json=objects_detection_format, verify=True)

        print("created cars on detection api: " + str(response.json()))

        return response.json()

    def detect_license_car(self, img_path):
        command = '''docker run -it --rm -v $(pwd):/data:ro openalpr -j -c eu ''' + img_path
        process = Popen(command,shell=True,stdout=subprocess.PIPE)
        result = process.communicate()
        a,b = result

        return json.loads(a)

    def write_detections_locally(self, responses, results):
        for index, response in enumerate(responses):
            img = results[index]["img"]
            detection_id = response["id"]
            path = self.images_path.format(detection_id) + '.png'
            print("path to save: " + str(path))
            cv2.imwrite(path.format(detection_id), img)

    def model_detect_car(self, car_to_detect, model, cars_meta, class_names, frame_number):
        img_width, img_height = 224, 224
    
    
        results = []
        
        for car in car_to_detect:
            image_name = car["countercars"]
            print(image_name)
            filename = os.path.join(self.processing_path, str(image_name) + '.jpg')
            print('Start processing image: {}'.format(filename))
            try:
                bgr_img = cv.imread(filename)
                bgr_img = cv.resize(bgr_img, (img_width, img_height), cv.INTER_CUBIC)
                rgb_img = cv.cvtColor(bgr_img, cv.COLOR_BGR2RGB)
                rgb_img = np.expand_dims(rgb_img, 0)
                preds = model.predict(rgb_img)
                license_car = self.detect_license_car(filename)
                license_plate = "N/A"
                if license_car["results"]:
                    license_plate = license_car["results"][0]["plate"]
                    print("plate: " + str(license_plate))
                    print("data: " + str(license_car["results"][0]))
                prob = np.max(preds)
                class_id = np.argmax(preds)
                results.append({'label': class_names[class_id][0][0], 'prob': '{:.4}'.format(prob), 'picture name': image_name, 'frame_number': car["detection_time"], 'detection_car': car["type"], 'license_car': license_plate, 'img': bgr_img})
                #text = ('Predict: {}, prob: {}'.format(class_names[class_id][0][0], prob))
                #cv.imwrite('Images/{}_out.png'.format(image_name), bgr_img)
                #cv2.imwrite(self.processing_path + "/" + str(i) + '.jpg', crop_img)

                print("successfully")
            except Exception as e:
                print(str(e))


        
        print(results)
        print("finished round of detetctions")

        responses = self.create_detections(results)

        self.write_detections_locally(responses, results)


        print("send it to the detection service")
        #K.clear_session()

    def crop_objects(self, width, height, image_np, output_dict, i):
        image = {}
        image["status"] = False
        
        global ymin, ymax, xmin, xmax
        #width, height = image.size

        #Coordinates of detected objects
        ymin = int(output_dict['detection_boxes'][0][0]*height)
        xmin = int(output_dict['detection_boxes'][0][1]*width)
        ymax = int(output_dict['detection_boxes'][0][2]*height)
        xmax = int(output_dict['detection_boxes'][0][3]*width)
        crop_img = image_np[ymin:ymax, xmin:xmax]

        # 1. Only crop objects that are detected with an accuracy above 50%, 
        # images 
        # with objects below 50% will be filled with zeros (black image)
        # This is something I need in my program
        # 2. Only crop the object with the highest score (Object Zero)

        if output_dict['detection_scores'][0] < 0.95:
            return image
        
        #print(crop_img.shape)
        
        if crop_img.shape[1] > 0 and crop_img.shape[0] > 0:
            #Save cropped object into image
            cv2.imwrite(self.processing_path + "/" + str(i) + '.jpg', crop_img)
            
        image["status"] = True
        image["crop_img"] = crop_img

        return image


    def print_length_video(self, cap):
        print("processing video: ")
        print(str(self.video_path))

         # print the length
        fps = cap.get(cv2.CAP_PROP_FPS)      # OpenCV2 version 2 used "CV_CAP_PROP_FPS"
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        self.frames_in_video = frame_count
        duration = frame_count/fps

        print('fps = ' + str(fps))
        print('number of frames = ' + str(frame_count))
        print('duration (S) = ' + str(duration))
        minutes = int(duration/60)
        seconds = duration%60
        print('duration (M:S) = ' + str(minutes) + ':' + str(seconds))


    def calc_processing_percents(self, video_capture):
        
        # get next frame number out of all the frames for video
        next_frame_no = video_capture.get(cv2.CAP_PROP_POS_FRAMES)
        # get total number of frames in the video
        total_frames = video_capture.get(cv2.CAP_PROP_FRAME_COUNT)

        complete = round(next_frame_no/total_frames, 4)

        self.processing_percents = format(complete * 100, ".2f")

        #print(self.processing_percents, "%")

    def object_detection_function(self, source_video, command):
        # input video
        cap = cv2.VideoCapture(self.video_path)

        #print info about video length
        self.print_length_video(cap)

        # Variables
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        # By default I use an "SSD with Mobilenet" model here. See the detection model zoo (https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) for a list of other models that can be run out-of-the-box with varying speeds and accuracies.
        # What model to download.
        MODEL_NAME = 'ssd_mobilenet_v1_coco_2018_01_28'
        MODEL_FILE = MODEL_NAME + '.tar.gz'
        DOWNLOAD_BASE = \
            'http://download.tensorflow.org/models/object_detection/'

        # Path to frozen detection graph. This is the actual model that is used for the object detection.
        PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'

        # List of the strings that is used to add correct label for each box.
        PATH_TO_LABELS = os.path.join('data', 'mscoco_label_map.pbtxt')

        NUM_CLASSES = 90

        # Download Model
        # uncomment if you have not download the model yet
        # Load a (frozen) Tensorflow model into memory.
        detection_graph = tf.Graph()
        with detection_graph.as_default():
            od_graph_def = tf.compat.v1.GraphDef() # use this line to run it with TensorFlow version 2.x
            with tf.compat.v2.io.gfile.GFile(PATH_TO_CKPT, 'rb') as fid: # use this line to run it with TensorFlow version 2.x
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def, name='')

        # Loading label map
        # Label maps map indices to category names, so that when our convolution network predicts 5, we know that this corresponds to airplane. Here I use internal utility functions, but anything that returns a dictionary mapping integers to appropriate string labels would be fine
        label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
        categories = label_map_util.convert_label_map_to_categories(label_map,
                max_num_classes=NUM_CLASSES, use_display_name=True)
        category_index = label_map_util.create_category_index(categories)


        model, cars_meta, class_names = self.load_model_init()
        count_frames = 0
        car_to_detect = []
        counter_cars = 0

        if(command=="imwrite"):
            fourcc = cv2.VideoWriter_fourcc(*'XVID')
            output_movie = cv2.VideoWriter(source_video.split(".")[0]+'_output.avi', fourcc, fps, (width, height))

        with detection_graph.as_default():
            # with tf.Session(graph=detection_graph) as sess:
            with tf.compat.v1.Session(graph=detection_graph) as sess: # use this line to run it with TensorFlow version 2.x

                # Definite input and output Tensors for detection_graph
                image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

                # Each box represents a part of the image where a particular object was detected.
                detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

                # Each score represent how level of confidence for each of the objects.
                # Score is shown on the result image, together with the class label.
                detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
                detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
                num_detections = detection_graph.get_tensor_by_name('num_detections:0')

                # for all the frames that are extracted from input video
                while cap.isOpened():
                    (ret, frame) = cap.read()

                    if not ret:
                        print ('end of the video file...')
                        break

                    input_frame = frame
                    count_frames = count_frames + 1
                    self.calc_processing_percents(cap)

                    # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
                    image_np_expanded = np.expand_dims(input_frame, axis=0)

                    # Actual detection.
                    (boxes, scores, classes, num) = \
                        sess.run([detection_boxes, detection_scores,
                                detection_classes, num_detections],
                                feed_dict={image_tensor: image_np_expanded})
                    
                    output_dict = {}
            
                    for box, score in zip(boxes, scores): 
                        for box_inside, score_inside in zip(box, score): 
                            counter_cars = counter_cars + 1
                            output_dict["detection_scores"] = []
                            output_dict["detection_scores"].append(score_inside)
                            output_dict["detection_boxes"] = []
                            output_dict["detection_boxes"].append([])
                            
                            output_dict["detection_boxes"][0].append(box_inside[0])
                            output_dict["detection_boxes"][0].append(box_inside[1])
                            output_dict["detection_boxes"][0].append(box_inside[2])
                            output_dict["detection_boxes"][0].append(box_inside[3])
                            result_crop = self.crop_objects(width, height, frame, output_dict, counter_cars)

                            if result_crop["status"] != False:
                                result_crop["countercars"] = counter_cars
                                result_crop["box"] = box_inside
                                #get time of detection
                                milliseconds = cap.get(cv2.CAP_PROP_POS_MSEC)
                                detection_time = self.get_detection_time(milliseconds)
                                result_crop["detection_time"] = detection_time
                                car_to_detect.append(result_crop) 

    
                    #Visualization of the results of a detection.
                    (counter, csv_line,  box_to_display_str_map, box_to_color_map) = \
                        vis_util.visualize_boxes_and_labels_on_image_array(
                        cap.get(1),
                        input_frame,
                        np.squeeze(boxes),
                        np.squeeze(classes).astype(np.int32),
                        np.squeeze(scores),
                        category_index,
                        use_normalized_coordinates=True,
                        line_thickness=4,
                        )


                    for type_box in box_to_display_str_map: 
                        val_type_car = box_to_display_str_map[type_box]
                        for car in car_to_detect:
                            if (np.array_equal(car["box"], type_box, equal_nan=False)):
                                car["type"] = val_type_car



                    if len(car_to_detect) > 1:
                        new_list = list(car_to_detect)
                        
                        print("try to process.....")

                        model, cars_meta, class_names = self.load_model_init()
                        self.model_detect_car(new_list, model, cars_meta, class_names, count_frames)
                        car_to_detect = []



                    if(command=="imshow"):
                        x = "imshow"
                        # cv2.imshow('vehicle detection', input_frame)

                        # if cv2.waitKey(1) & 0xFF == ord('q'):
                        #     break
                    elif(command=="imwrite"):
                        output_movie.write(input_frame)
                        #print("writing frame...")

                    if csv_line != 'not_available':
                        with open('traffic_measurement.csv', 'a') as f:
                            writer = csv.writer(f)
                            (size, color, direction, speed) = \
                                csv_line.split(',')
                            writer.writerows([csv_line.split(',')])
                cap.release()
                #cv2.destroyAllWindows()


    def start_detection(self):
        print('start detections')
        self.object_detection_function(self.video_path, "imshow")
        

    def run(self):
        self.start_detection() 

    