from typing import List
from flask_restx.fields import String
from config_service import ConfigService
from process import Process
from process_anomaly import ProcessAnomaly
from process_faces import ProcessFaces

from dtos.process_dto import ProcessDto



class ProcessManager():

    def __init__(self):
        self._processes = {}

    def create_process(self, video_path: String, context_id: String, face_clustering, face_detection) -> None:
        process: ProcessFaces = ProcessFaces(video_path, context_id, face_clustering, face_detection)
        if context_id in self._processes.keys():
            self._processes[context_id].append(process)
        else:
            self._processes[context_id] = [process]
        process.start()

    def create_anomaly_process(self, video_path: String, context_id: String) -> None:
        process: ProcessAnomaly = ProcessAnomaly(video_path, context_id)
        if context_id in self._processes.keys():
            self._processes[context_id].append(process)
        else:
            self._processes[context_id] = [process]
        process.start()

    def get_processing_percents_by_context_id(self, context_id: String) -> String:
        processes: list = self._processes[context_id]
        mins = []
        for proc in processes:
            mins.append(proc.processing_percents)
        return min(mins)

    def get_all_process(self):
        processes = []
        for key, process in self._processes.items():
            for proc in process:
                processes.append(ProcessDto(proc).tojson())
        return processes

    def get_process_by_id(self, context_id) -> List[ProcessDto]:
        return [ProcessDto(context_process).tojson() for context_process in self._processes[context_id]]
