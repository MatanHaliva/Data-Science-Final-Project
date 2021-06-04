import React, {Fragment, useState, useEffect  } from "react"
import { Helmet } from "react-helmet"
import Video from "../components/Video"
import Log from "../components/Log"
import axios from 'axios'
import * as style from "./index.module.css"
import Layout from "../components/Layout"
import { detectionTypes } from "../../shared/detectionTypes"
import { useSelector } from 'react-redux'

const calculateTime = (timeStampCreated) => {
    return (+new Date() - timeStampCreated) / 1000
}

const AnalyseVideo = ({contextId, filePath, setVideoCurrentTime, videoCurrentTime}) => {
    const videoUrl = `http://localhost:33345${filePath}`
    const detectionApi = `https://detections-api.azurewebsites.net/Detections`
    const [detections, setDetections] = useState([])
    const [videoTime, setVideoTime] = useState({})

    const triggerValue = {s: 'trigger'}

    let feedbackResponses = useSelector(state => {
        return state.app.feedbackResponses
    }) || []

    const convertToPresentation = (detections) => {
        return detections.map(detection => {
            return {
                id: detection.ContextId,
                description: detection.Description,
                detectionTypeName: detectionTypes[detection.DetectionType],
                detectionType: detection.DetectionType,
                detectionTime: detection.DetectionTime,
                accuracy: detection.Accuracy,
                licensePlate: detection.LicensePlate,
                manufacturer: detection.Manufacturer,
                color: detection.Color
            }
        })
    }

    const getDetections = async () => {
        try {
            const detections = await axios.get(`${detectionApi}/GetById/${contextId}`)
            //setDetections(convertToPresentation(detections.data))
            setDetections(convertToPresentation([
                {ContextId: 1, Description: "hi", DetectionType: 0, DetectionTime: 1, Accuracy: 0.99, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "white"},
                {ContextId: 1, Description: "hi", DetectionType: 0, DetectionTime: 4, Accuracy: 0.99, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "white"},
                {ContextId: 1, Description: "hi", DetectionType: 0, DetectionTime: 7, Accuracy: 0.99, LicensePlate: "32-355-3", Manufacturer: "Honda", Color: "white"},
                {ContextId: 1, Description: "hi", DetectionType: 0, DetectionTime: 11, Accuracy: 0.99, LicensePlate: "32-345555533-3", Manufacturer: "Honda", Color: "white"},
                {ContextId: 1, Description: "hi", DetectionType: 0, DetectionTime: 14, Accuracy: 0.99, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "white"},
    
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 18, Accuracy: 0.99, LicensePlate: "32-3-3", Manufacturer: "Hyundai", Color: "white"},
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 15, Accuracy: 0.97, LicensePlate: "32-3555-3", Manufacturer: "Tesla", Color: "red"},
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 20, Accuracy: 0.97, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "black"},
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 30, Accuracy: 0.99, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "green"},
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 35, Accuracy: 0.95, LicensePlate: "32-3-3", Manufacturer: "Honda", Color: "black"},
                {ContextId: 2, Description: "hi", DetectionType: 0, DetectionTime: 45, Accuracy: 0.95, LicensePlate: "32-35-3", Manufacturer: "Honda", Color: "black"}
    
            ]))
        } catch (err) {

        }
    }

    useEffect(() => {
        getDetections()
    }, [contextId]);

    return (
        <Layout>
            <Helmet
                bodyAttributes={{
                    class: 'overflow-body'
                }}
            />
            <div className="d-flex flex-row">
                <div className={`${style.flex_grow_4} p-2`}>
                    <Video videoHeight='100%' videoWidth='100%' videoUrl={videoUrl} setVideoCurrentTime={setVideoCurrentTime}/>
                </div>
                <div className={`${style.flex_grow_2} p-3`}>
                    <Log videoTime={videoCurrentTime} rows={detections}/>
                </div>
            </div>
      
            <div class="toast-container position-absolute p-3 top-10 start-0 show">
                {feedbackResponses.filter(feedbackResponse => {
                    // debugger
                    // return feedbackResponse.timeStamp > +new Date() - 5000
                    return feedbackResponse
                }).map(feedbackResponse => {
                    return (
                            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                                <div class="toast-header">
                                    <strong class="me-auto">Feedback</strong>
                                    <small>{Math.ceil(calculateTime(feedbackResponse.timeStamp))} secs ago</small>
                                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div class="toast-body">
                                    Thanks for giving us feedback now we will remember it! :) 
                                </div>
                            </div>
                        )
                })}
            </div>
            
        </Layout>
    )
}

export default AnalyseVideo