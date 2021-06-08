import React, {Fragment, useState, useEffect  } from "react"
import { useSelector } from 'react-redux'
import * as style from "./css/LogToast.module.css"
import Feedback from "./Feedback"
import axios from "axios"
import { detectionTypes } from "../../shared/detectionTypes"

const feedbackUrl = `https://feedbacks-api.azurewebsites.net/Feedbacks/GetAll`

const carLogToast = ({licensePlate, color, manufacturer}) => {
    return (
        <Fragment>
            <div><b>Car Details: </b></div>
            <div>License car: {licensePlate} </div>
            <div>Manufacturer: {manufacturer}</div>
            <div>Color: {color}</div>
        </Fragment>
    )
}

const faceLogToast = ({faceId}) => {
    return (
        <Fragment>
            <div><b>Face Details: </b></div>
            <div>Face Id: { faceId === '-1' ? "Unknown" : faceId} </div>
        </Fragment>
    )
}

const anomalyLogToast = ({severity}) => {
    return (<Fragment>
        <div><b>Anomaly Details: </b></div>
        <div>Severity: {severity} </div>
    </Fragment>)
}

const LogToast = ({id, detectionTime, description, detectionType, detectionTypeName, accuracy, toastShowFade, licensePlate, color, manufacturer, img, faceId, severity}) => {
    const [feedbackData, setFeedBackData] = useState({found: false, personName: "N/A", loading: true})
    
    let feedbackResponses = useSelector(state => {
        return state.app.feedbackResponses
    }) || []

    useEffect(async () => {
        const getFeedbackForLicense = await axios.get(feedbackUrl)
        const getFeedback = getFeedbackForLicense.data.filter(feedback => feedback.LicensePlate === licensePlate)
        if (!!getFeedback.length) {
            setFeedBackData({found: true, personName: getFeedback[0].PersonName, loading: false})
        } else {
            setFeedBackData({found: false, personName: "N/A", loading: false})
        }
    }, [licensePlate, feedbackResponses])

    return (
        <Fragment>
            <div style={{'margin-bottom': "10px"}} className={`${toastShowFade} ${detectionType === 4 ? 'anomaly-div' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#f09126"></rect></svg>
                    <strong className="me-auto">Detection Found</strong>
                    <small className="text-muted">Video Time: {detectionTime}</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div className="toast-body">
                    {
                    <Fragment>
                        {<div className={`${detectionType !== 4 ? `img-float-right` : `img-float-right-warning`}`}><img src={img}/></div>}
                        <div><b>Generic details</b></div>
                        <strong className="me-auto">Id: {id.slice(0, 10)}</strong>
                        <div> Detection Time: {detectionTime}</div>
                        <div> Detection Type Name: {detectionTypeName}</div>
                        <div> Description: {description}</div>
                        <div> Accuracy: {accuracy}</div>
                        {detectionType === 0 ? carLogToast({licensePlate, color, manufacturer}) : detectionType === 1 ? faceLogToast({faceId}) : anomalyLogToast({severity})}
                        <br/>
                        <div><b> History Knowledge: </b></div>
                        {
                        feedbackData.loading ?
                        <Fragment>
                            <div className="loading-spinner">
                                <div class="spinner-border text-warning" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </Fragment>
                        :
                        !feedbackData.found
                        ? 
                        <Feedback feedbackType={detectionType} licensePlate={licensePlate} faceId={faceId}/> 
                        : 
                        detectionType === 0 
                        ?
                        <div>This car belongs to: { feedbackData.personName } </div>
                        :
                        detectionType === 1 
                        ?
                        <div>This Face is {feedbackData.personName} </div>
                        :
                        <Fragment/>
                        }
                    </Fragment>
                    }
                </div>
            </div>
        </Fragment>
    )
}


export default LogToast