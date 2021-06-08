from flask import Flask
from flask_restx import Api, Resource, fields
from process_manager import ProcessManager
from flask_cors import CORS

process_manager = ProcessManager()

app = Flask(__name__)
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
            recording_file_dto["filePath"], recording_file_dto["contextId"])
        print("send")
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

        try:
            processing_percents = process_manager.get_processing_percents_by_context_id(
                context_id)
            return {"processingPercents": processing_percents}, 200
        except KeyError:
            return {"message": "context_id not found"}, 404


if __name__ == '__main__':
    app.run(debug=True)
