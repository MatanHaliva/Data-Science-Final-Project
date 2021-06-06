from flask import Flask,send_file,send_from_directory
from flask_restx import Api, Resource, fields
from process_manager import ProcessManager
from flask_cors import CORS
from face_clustering import FaceClustering
from detectors.face_detector import FaceDetection
import os

process_manager: ProcessManager = ProcessManager()
face_clustering = FaceClustering()
face_detection = FaceDetection()

app = Flask(__name__, static_url_path='')
cors = CORS(app)
app.config.from_object(__name__)
# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

api = Api(app, version='1.0', title='Rest API',
          description='A simple Rest API', validate=True
          )

recording_file_dto = api.model('recordingFileDto', {
    'contextId': fields.String(required=True, description='The user unique identifier'),
    'filePath': fields.String(required=True, description='The path of recording')
})

@api.route('/startProcess')
class DetectorService(Resource):

    @api.expect(recording_file_dto)
    def post(self):
        print("startProcess")
        recording_file_dto = api.payload
        process_manager.create_process(
            recording_file_dto["filePath"], recording_file_dto["contextId"], face_clustering, face_detection)
        print("send")
        return recording_file_dto, 200

@api.route('/startAnomalyProcess')
class DetectorService(Resource):

    @api.expect(recording_file_dto)
    def post(self):
        recording_file_dto = api.payload
        process_manager.create_anomaly_process(
            recording_file_dto["filePath"], recording_file_dto["contextId"])
        return recording_file_dto, 200

@api.route('/processes')
class ProcessService(Resource):

    def get(self):
        return process_manager.get_all_process(), 200

@api.route('/processes/<string:context_id>')
class ProcessService(Resource):

    def get(self, context_id):
        try:
            process = process_manager.get_process_by_id(context_id)
            return process, 200
        except KeyError:
            return {"message": "context_id not found"}, 404

@api.route('/checkStatus/<string:context_id>')
class DetectorService(Resource):

    def get(self, context_id):

        print("checkStatus")
        try:
            processing_percents = process_manager.get_processing_percents_by_context_id(
                context_id)
            return {"processingPercents": processing_percents}, 200
        except KeyError:
            return {"message": "context_id not found"}, 404

@api.route('/startClustering')
class ClusteringService(Resource):

    def post(self):
        video_list = api.payload

        dir_path = video_list[0]

        video_list = os.listdir(dir_path)

        faces=[]

        for video_path in video_list:
            path = "{}/{}".format(dir_path,video_path)
            faces.extend(face_detection.get_faces_from_video(path))

        face_clustering.start(faces)

@api.route('/processes/<string:context_id>/getVideo')
class RecordingsService(Resource):
    def get(self, context_id):
        try:
            filename = "faces/context_id_{}/".format(context_id)
            print(filename)
            result = send_from_directory(filename , "output.mp4")
            print(result)

            return result
        except FileNotFoundError:
            return {"message": "file not found"}, 404

@api.route('/processes/<string:context_id>/<string:face_id>/<string:detection_id>/getImage')
class GetImageService(Resource):
    def get(self, context_id, face_id, detection_id):
        try:
            filename = "faces/context_id_{}/{}/{}.png".format(context_id,face_id,detection_id)
            return send_file(filename, mimetype='image/png', as_attachment=True)
        except FileNotFoundError:
            return {"message": "file not found"}, 404

@app.route('/faces/context_id_2de68d63-88eb-44ed-92fa-667956a0e39b/0/')
def send_js(path):
    return send_from_directory('/faces/context_id_2de68d63-88eb-44ed-92fa-667956a0e39b/0', path)

if __name__ == '__main__':
    app.run(debug=False, port=5009)
