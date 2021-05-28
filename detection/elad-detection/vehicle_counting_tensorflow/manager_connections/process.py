import threading
import time

import cv2 as cv2


class Process(threading.Thread):
    def __init__(self, video_path, context_id):
        threading.Thread.__init__(self)
        self.context_id = context_id
        self.video_path = video_path
        self.processing_percents = 0
        print("init", context_id)

    def start_detection(self):
        print('start detections')
        

    def run(self):
        self.start_detection() 

    