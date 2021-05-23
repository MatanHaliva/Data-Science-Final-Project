from process import Process

class ProcessDto:

    def __init__(self, process: Process):
        self.contextId = process.context_id
        self.videoPath = process.video_path
        self.processingPercents = process.processing_percents
    
    def tojson(self):
        return self.__dict__