from threading import Thread
import queue

import numpy as np
from numpy import load
from numpy import asarray
from numpy import expand_dims
from numpy import savez_compressed
from tensorflow.python.keras.models import load_model
from tensorflow.keras.layers import LayerNormalization
from os import listdir
from os.path import isfile, join, isdir
from PIL import Image
import matplotlib.pyplot as plt
from anomaly_detection_dto import AnomalyDetectionDto
from save_detections import SaveDetections
import cv2 as cv2
import time
import os


class AnomalyDetection:

    def __init__(self):
        model_file = "models/model_lstm.hdf5"
        self.model = load_model(model_file, custom_objects={'LayerNormalization': LayerNormalization})
        self.batch_size = 4
        self.cache_dir = "C:/Users/tamirh/Documents/ped1/cache/"
        self.queue = queue.Queue()
        self.rec_thread: Thread
        self.sample_size = 200

    def __addToQueue(self):
        if self.queue.empty():
            return 1
        else:
            d = self.queue.queue
            return d[-1] + 1

    def __getFromQueue(self):
        if self.queue.empty() and not self.rec_thread.is_alive():
            return None
        else:
            return self.queue.get()

    def get_single_test(self, test: np.ndarray) -> None:
        sz = test.shape[0] - 10 + 1
        sequences = np.zeros((sz, 10, 256, 256, 1))
        # apply the sliding window technique to get the sequences
        for i in range(0, sz):
            clip = np.zeros((10, 256, 256, 1))
            for j in range(0, 10):
                clip[j] = test[i + j, :, :, :]
            sequences[i] = clip
        next_cache_file: int = self.__addToQueue()
        np.save(self.cache_dir + str(next_cache_file), sequences)
        self.queue.put(next_cache_file)

    #        last_file: int = max(list(map(lambda x: int(x[:-4]), os.listdir(self.cache_dir))))
    #        return sequences, sz

    def get_anomaly(self, video) -> np.array:
        def start_recording_thread():
            vs = cv2.VideoCapture(video)
            test = np.zeros(shape=(self.sample_size, 256, 256, 1))
            cnt = 0
            while (1):
                if cnt == self.sample_size:
                    print("aaaaaaaaaaaaaa")
                    self.get_single_test(test)
                    test = np.zeros(shape=(self.sample_size, 256, 256, 1))
                    cnt = 0
                ret, frame = vs.read()
                if frame is None:
                    print("done reading")
                    if test.any():
                        self.get_single_test(test)
                    break
                img = cv2.resize(frame, (256, 256))
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                img = np.array(img, dtype=np.float32) / 256.0
                test[cnt, :, :, 0] = img
                cnt = cnt + 1

        self.rec_thread = Thread(target=start_recording_thread, args=())
        self.rec_thread.daemon = True
        self.rec_thread.start()
        srs = []
        video_counter = 0
        while not self.queue.empty() or self.rec_thread.is_alive():
            np_predict_array = str(self.__getFromQueue())
            sequences = np.load(self.cache_dir + np_predict_array + ".npy")
            os.remove(self.cache_dir + np_predict_array + ".npy")
            sequences_shape = sequences.shape[0]
            reconstructed_sequences = self.model.predict(sequences, batch_size=self.batch_size)
            sequences_reconstruction_cost = np.array(
                [np.linalg.norm(np.subtract(sequences[i], reconstructed_sequences[i])) for i in
                 range(0, sequences_shape)])
            sa = (sequences_reconstruction_cost - np.min(sequences_reconstruction_cost)) / np.max(
                sequences_reconstruction_cost)
            srs.append((1.0 - sa, video_counter))
            # plot the regularity scores
            plt.plot(1.0 - sa)
            plt.ylabel('regularity score Sr(t)')
            plt.xlabel('frame t')
            plt.show()
            video_counter += 1
        return srs

    def detect_anomaly(self, video):
        # TODO: return the up and down trends from the prediction
        srs: list = self.get_anomaly(video)
        anomal = []
        while(srs):
            sr_score, video_idx = srs.pop(0)
            ll = [(*idx, val) for idx, val in np.ndenumerate(sr_score)]
            ll = list(filter(lambda x: x[1] < 0.95, ll))
            cnt = 0
            start = 0
            for x in range(1, len(ll)):
                if (ll[x][0] - ll[x - 1][0] == 1 and ll[x][0] <  self.sample_size-1):
                    cnt += 1
                else:
                    anomal.append((cnt, start+(video_idx*len(sr_score)), (ll[x - 1][0] + 10)+(video_idx*self.sample_size)))
                    start = (ll[x][0]+1)
                    cnt = 1
            anomal.append((cnt, start, (ll[len(ll) - 1][0] + 10)+(video_idx*self.sample_size)))
        #        print(anomal)
        #        print( list(filter(lambda x: x[0] > 6, anomal)))
        anomaly = {
            "irregularity": list(filter(lambda x: x[0] > 6, anomal))
        }
        return anomaly


# vs = cv2.VideoCapture("C:/Users/tamirh/Documents/ped1/testing/frames/32/%3d.jpg")
# (grabbed, frame) = vs.read()
start_time = time.time()
bla = AnomalyDetection().detect_anomaly("C:/Users/tamirh/Documents/ped1/testing/frames/05/%3d.jpg")
print("--- %s seconds ---" % (time.time() - start_time))
print(bla["irregularity"])
message: AnomalyDetectionDto = AnomalyDetectionDto(1, 2 , "Anomaly" ,"Anomaly was detected", bla["irregularity"], "MEDIUM")
SaveDetections.save(message)
