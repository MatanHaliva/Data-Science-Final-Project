import React from "react"
import { Fragment } from "react"
import { useDispatch } from 'react-redux'

const Feedback = ({feedbackType, licensePlate}) => {
    const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();

        dispatch({type: 'NEW_FEEDBACK_SUBMITED', payload: {
            LicensePlate: licensePlate,
            GoodDetection: event.target.approve.value === "on" ? true : false,
            FeedbackType: feedbackType,
            PersonName: event.target.ownerName.value
        }})
    }

    const carFeedback = () => {
        return (
            <Fragment>
                <form onSubmit={handleSubmit} className="d-flex flex-column">
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
            </Fragment>
        )
    }

    const faceFeedback = () => {
        return (
            <Fragment>

            </Fragment>
        )   
    }



    return feedbackType === 0 ? carFeedback() : faceFeedback()

}

export default Feedback