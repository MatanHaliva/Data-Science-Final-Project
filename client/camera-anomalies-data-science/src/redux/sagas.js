import { delay, call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import axios from "axios"
import { FEEDBACK_CREATED_SUCCESSFULY, DELETE_FEEDBACK_CREATED_SUCCESSFULY} from "./actions"


const feedbackCarUrl = `https://feedbacks-api20210802232513.azurewebsites.net/Feedbacks/CreateCar`
const feedbackFaceUrl = `https://feedbacks-api20210802232513.azurewebsites.net/Feedbacks/CreatePerson`

function* createFeedback(action) {
   debugger
    try {
       const feedback = yield call((feedbackDto, feedbackUrl) => axios.post(feedbackDto.FeedbackType === 0 ? feedbackCarUrl : feedbackFaceUrl, [feedbackDto]), action.payload)
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