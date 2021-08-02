from flask import Flask
from flask_restx import Api, Resource
from flask_cors import CORS
from aggregation_service import AggregationService

app = Flask(__name__, static_url_path='')

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

aggregation_service = AggregationService()

cors = CORS(app)
app.config.from_object(__name__)
# enable CORS
CORS(app, resources={r'/*': {'origins': '*'}})

api = Api(app, version='1.0', title='Rest API',
          description='A simple Rest API', validate=True
          )

@api.route('/<string:context_id>')
class AggregationService(Resource):

    def get(self, context_id):
        try:
            process = aggregation_service.create_groups_by_context_id(context_id)
            return process, 200
        except KeyError:
            return {"message": "context_id not found"}, 404

if __name__ == '__main__':
    app.run(debug=True, port=5010)
