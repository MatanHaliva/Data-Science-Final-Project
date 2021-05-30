from flask_restx.fields import String
from process import Process
from process_dto import ProcessDto

class ProcessManager():

    def __init__(self):
        self._processes = {}

    def create_process(self, video_path, context_id):
        process = Process(video_path, context_id)
        self._processes[context_id] = process
        process.start()

    def get_processing_percents_by_context_id(self, context_id):

        process = self._processes[context_id]
        return process.processing_percents

    def get_all_process(self):
        processes = []
        for key, process in self._processes.items():
            processes.append(ProcessDto(process).tojson())
        return processes

    def get_process_by_id(self, context_id):
        return ProcessDto(self._processes[context_id]).tojson()
