from flask_restx.fields import String
from typing import List

from config_service import ConfigService
from process_anomaly import ProcessAnomaly
from process_dto import ProcessDto
from face_clustering import FaceClustering
from process_faces import ProcessFaces
from process import Process

class ProcessManager():

    def __init__(self):
        self._processes = {}
        self.face_clustering = FaceClustering()

    def create_process(self, video_path: String, context_id: String) -> None:
        # process: ProcessFaces = ProcessFaces(video_path, context_id, self.face_clustering)
        process: Process = Process(video_path, context_id)
        self._processes[context_id] = [process]
        # process.start()
        if ConfigService.detection_api_enabled():
            self.create_anomaly_process(video_path, context_id)

    def create_anomaly_process(self, video_path: String, context_id: String) -> None:
        process: ProcessAnomaly = ProcessAnomaly(video_path, context_id)
        self._processes[context_id].append(process)
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
