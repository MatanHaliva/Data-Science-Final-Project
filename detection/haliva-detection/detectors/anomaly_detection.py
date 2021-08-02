from threading import Thread
import queue

import numpy as np
import tensorflow as tf
from keras.layers import LayerNormalization
import matplotlib.pyplot as plt
import cv2 as cv2
import os

tf.config.optimizer.set_experimental_options({'layout_optimizer': False})
class AnomalyDetection:
    def __init__(self, cache_dir="cache/", tolerance_frames=5, container_anomaly_process=None):
        model_file = "models/model_lstm_gil.hdf5"
        self.model = tf.keras.models.load_model(model_file, custom_objects={'LayerNormalization': LayerNormalization})
        self.batch_size = 1
        self.cache_dir = cache_dir
        self.queue = queue.Queue()
        self.rec_thread: Thread
        self.sample_size = 200
        self.tolerance_frames = tolerance_frames
        self.total_frames = 0
        self.done_tasks = [0]
        self.container_anomaly_process = container_anomaly_process

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
        print("anomaly: add to queue")
        next_cache_file: int = self.__addToQueue()
        np.save(self.cache_dir + str(next_cache_file), sequences)
        self.queue.put(next_cache_file)

    def calc_processing_percents(self, video_capture):

        # get next frame number out of all the frames for video
        next_frame_no = video_capture.get(cv2.CAP_PROP_POS_FRAMES)
        # get total number of frames in the video
        total_frames = video_capture.get(cv2.CAP_PROP_FRAME_COUNT)

        complete = round(next_frame_no/total_frames, 4)

        self.container_anomaly_process.processing_percents = format(complete * 100, ".2f")

        print("anomaly", self.container_anomaly_process.processing_percents, "%")

    def get_anomaly(self, video) -> np.array:
        def start_recording_thread():
            print("anomaly: start_recording_thread")
            vs = cv2.VideoCapture(video)
            property_id = int(cv2.CAP_PROP_FRAME_COUNT)
            test_length = int(cv2.VideoCapture.get(vs, property_id))
            self.total_frames = vs.get(cv2.CAP_PROP_FRAME_COUNT)
            # test_length = len(list(filter(lambda x: '.jpg' in x, os.listdir(video[:-7]))))
            sz = self.sample_size if test_length >= self.sample_size else test_length
            test_length = test_length - sz
            test = np.zeros(shape=(sz, 256, 256, 1))
            cnt = 0
            while (1):
                self.calc_processing_percents(vs)
                if cnt == sz:
                    print("anomaly: batch checkpoint")
                    self.get_single_test(test)
                    sz = self.sample_size if test_length >= self.sample_size else test_length
                    test_length = test_length - sz
                    test = np.zeros(shape=(sz, 256, 256, 1))
                    cnt = 0
                ret, frame = vs.read()
                if frame is None:
                    print("anomaly: finish going over frames")
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
        print("anomaly: before while not queue")
        while not self.queue.empty() or self.rec_thread.is_alive():
            print("anomaly: queue is not empty")
            np_predict_array = str(self.__getFromQueue())
            print("anomaly: queue is not empty 1")
            sequences = np.load(self.cache_dir + np_predict_array + ".npy")
            print("anomaly: queue is not empty 2")
            os.remove(self.cache_dir + np_predict_array + ".npy")
            print("anomaly: queue is not empty 3")
            sequences_shape = sequences.shape[0]
            print("anomaly: queue is not empty 4")
            reconstructed_sequences = self.model.predict(sequences, batch_size=self.batch_size)
            print("anomaly: queue is not empty 5")
            sequences_reconstruction_cost = np.array(
                [np.linalg.norm(np.subtract(sequences[i], reconstructed_sequences[i])) for i in
                range(0, sequences_shape)])
            print("anomaly: queue is not empty 6")
            sa: np.ndarray = (sequences_reconstruction_cost - np.min(sequences_reconstruction_cost)) / np.max(
                sequences_reconstruction_cost)
            print("anomaly: queue is not empty 7")
            srs.append((1.0 - sa, video_counter))
            print("anomaly: queue is not empty 8")
            self.done_tasks[0] += 1
            print("anomaly: queue is not empty 9")
            # plot the regularity scores
            # plt.plot(1.0 - sa)
            # plt.ylabel('regularity score Sr(t)')
            # plt.xlabel('frame t')
            # plt.show()
            video_counter += 1

        print("anomaly: finished")
        return srs

    def detect_anomaly(self, video):
        print("anomaly: detect_anomaly before get_anomaly")
        srs: list = self.get_anomaly(video)
        print("anomaly: detect_anomaly after get_anomaly")
        total_clip_sr, video_idx = srs.pop(0)
        anomal = []
        anomal2 = []
        while (srs):
            sr_score, video_idx = srs.pop(0)
            total_clip_sr = np.concatenate((total_clip_sr, sr_score))
        # plt.plot(total_clip_sr)
        # plt.ylabel('regularity score Sr(t)')
        # plt.xlabel('frame t')
        # plt.show()
        ll = [(*idx, val) for idx, val in np.ndenumerate(total_clip_sr)]
        ll = list(filter(lambda x: x[1] < 0.88, ll))
        if ll:
            cnt = 0
            start = ll[0][0]
            for x in range(1, len(ll)):
                if (ll[x][0] - ll[x - 1][0] == 1 and ll[x][0] < len(total_clip_sr) - 1):
                    cnt += 1
                else:
                    # anomal.append((cnt, start,(ll[x - 1][0] + 10)))
                    if cnt > self.tolerance_frames:
                        min_val = min(list(total_clip_sr)[start:(ll[x - 1][0] + 10)])
                        anomal2.append((cnt, list(total_clip_sr).index(min_val) / self.total_frames, min_val))
                    start = (ll[x][0] + 1)
                    cnt = 1
            # anomal.append((cnt, start,(ll[x - 1][0] + 10)))
            if cnt > self.tolerance_frames:
                min_val = min(list(total_clip_sr)[start:len(total_clip_sr)])
                anomal2.append((cnt, list(total_clip_sr).index(min_val) / self.total_frames, min_val))

        # print(anomal2)
        anomaly = {
            "anomaly": anomal2,
        }
        print("anomaly: " + str(anomaly))
        return anomaly

#
# start_time = time.time()
# bla = AnomalyDetection().detect_anomaly("C:/Users/tamirh/Downloads/videos/test/012.avi")
# print("--- %s seconds ---" % (time.time() - start_time))
# for detection in bla["anomaly"]:
#     message: AnomalyDetectionDto = AnomalyDetectionDto(1, detection[1],
#                                                        DetectionType.Anomaly.value, "Anomaly was detected",
#                                                        detection[0], ConfigService.anomaly_detection_ranges(detection[2]))
#     DetectionApiConnector.create_detection(message)
