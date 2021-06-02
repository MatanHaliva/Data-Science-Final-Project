import { delay, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from "axios"
import { FEEDBACK_CREATED_SUCCESSFULY, DELETE_FEEDBACK_CREATED_SUCCESSFULY} from "./actions"


const feedbackUrl = `https://feedbacks-api.azurewebsites.net/Feedbacks/CreateCar`

function* createFeedback(action) {
    try {
       const feedback = yield call((feedbackDto, feedbackUrl) => axios.post(feedbackUrl, [feedbackDto]), action.payload, feedbackUrl)
       const payload = {feedback, timeStamp: + new Date()}
       yield put({type: FEEDBACK_CREATED_SUCCESSFULY, payload})
       console.log("start")
       yield delay(5000)
       console.log("finish")
       yield put({type: DELETE_FEEDBACK_CREATED_SUCCESSFULY, payload})
    } catch (e) {
       console.log("error: " + e)
       yield put({type: "FEEDBACK_CREATED_FAILED", message: e.message});
    }
 }

function* myCreateFeedbackSaga() {
    yield takeEvery("NEW_FEEDBACK_SUBMITED", createFeedback);
}


  export default myCreateFeedbackSaga;