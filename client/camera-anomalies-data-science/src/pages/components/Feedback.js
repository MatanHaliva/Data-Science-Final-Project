import React from "react"
import { Fragment } from "react"
import { useDispatch } from 'react-redux'

const Feedback = ({feedbackType, licensePlate, faceId}) => {
    const dispatch = useDispatch()

    const handleCarSubmit = (event) => {
        event.preventDefault();

        dispatch({type: 'NEW_FEEDBACK_SUBMITED', payload: {
            LicensePlate: licensePlate,
            GoodDetection: event.target.approve.value === "on" ? true : false,
            FeedbackType: feedbackType,
            PersonName: event.target.ownerName.value
        }})
    }

    const handleFaceSubmit = (event) => {
        event.preventDefault();

        dispatch({type: 'NEW_FEEDBACK_SUBMITED', payload: {
            FaceId: faceId,
            GoodDetection: event.target.approve.value === "on" ? true : false,
            FeedbackType: feedbackType,
            PersonName: event.target.ownerName.value
        }})
    }

    const faceFeedback = () => {
        return (
            <Fragment>
                {
                faceId !== -1 
                ?
                <form onSubmit={handleFaceSubmit} className="d-flex flex-column">
                    <div>Do you know recognise this guy?</div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" for="inlineCheckbox1">Approve</label>
                        <input name="approve" class="form-check-input" type="checkbox" id="inlineCheckbox1"/>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" for="inlineCheckbox2">Person Name: </label>
                        <input name="ownerName" type="text" id="inlineCheckbox2"/>
                    </div>
                    <input type="submit" value="Submit" className="btn float-right login_btn"/>
                </form>
                :
                <Fragment>
                    <div>
                        Do not have any feedback 'cause faceId is not found.
                    </div>
                </Fragment>
                }
                
            </Fragment>
        )
    }

    const carFeedback = () => {
        return (
            <Fragment>
                {
                licensePlate !== "" 
                ?
                <form onSubmit={handleCarSubmit} className="d-flex flex-column">
                    <div>Do you know this car owner?</div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" for="inlineCheckbox1">Approve</label>
                        <input name="approve" class="form-check-input" type="checkbox" id="inlineCheckbox1"/>
                    </div>
                    <div class="form-check form-check-inline">
                        <label class="form-check-label" for="inlineCheckbox2">Owner Name: </label>
                        <input name="ownerName" type="text" id="inlineCheckbox2"/>
                    </div>
                    <input type="submit" value="Submit" className="btn float-right login_btn"/>
                </form>
                :
                <Fragment>
                    <div>
                        Do not have any feedback 'cause license car is not found.
                    </div>
                </Fragment>
                }
            </Fragment>
        )   
    }


    return feedbackType === 0 ? carFeedback() : feedbackType === 1 ? faceFeedback() : <Fragment><div>No Feedback for this detection type.</div></Fragment>
}

export default Feedback