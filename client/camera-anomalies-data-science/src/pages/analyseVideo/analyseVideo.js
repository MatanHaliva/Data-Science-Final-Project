import React, {Fragment, useState, useEffect  } from "react"
import { Helmet } from "react-helmet"
import Video from "../components/Video"
import Log from "../components/Log"
import axios from 'axios'
import * as style from "./index.module.css"
import Layout from "../components/Layout"
import { detectionTypes } from "../../shared/detectionTypes"
import { useSelector } from 'react-redux'
import { getImagePath } from "./helper"

const calculateTime = (timeStampCreated) => {
    return (+new Date() - timeStampCreated) / 1000
}

const AnalyseVideo = ({contextId, filePath, setVideoCurrentTime, videoCurrentTime}) => {
    const videoUrl = `http://localhost:33345${filePath}`
    const videoUrlPostProcessing = `http://localhost:5009/processes/${contextId}/getVideo`
    const detectionApi = `https://detections-api20210802233301.azurewebsites.net/Detections`
    const groupedDetectionApi = `http://localhost:5010/`

    const endpoint = 'http://localhost:33345'
    const pathUrlProcess = `${endpoint}/process`

    const [detections, setDetections] = useState([])
    const [detectionsAnomaly, setDetectionsAnomaly] = useState([])
    const [finishProcessing, setFinishProcessing] = useState(false)
    const [videoTime, setVideoTime] = useState({})

    let userToken = useSelector(state => {
        return state.login.loggedToken
    })
    
    const triggerValue = {s: 'trigger'}

    let feedbackResponses = useSelector(state => {
        return state.app.feedbackResponses
    }) || []

    const convertToPresentation = (detections) => {
        return detections.map(detection => {
            return {
                id: detection.Id,
                contextId: detection.ContextId,
                description: detection.Description,
                detectionTypeName: detectionTypes[detection.DetectionType],
                detectionType: detection.DetectionType,
                detectionTime: Math.round((detection.DetectionTime + Number.EPSILON) * 100) / 100,
                accuracy: detection.Accuracy,
                licensePlate: detection.LicensePlate,
                manufacturer: detection.Manufacturer,
                color: detection.Color,
                img: getImagePath(detection),
                faceId: detection.FaceId,
                severity: detection.AnomalySeverity
            }
        })
    }

    const orderByDetectionTime = (detections) => {
        // return detections
        return detections.sort((a,b) => {
            if(a.detectionTime > b.detectionTime){
                return 1
            }
            else if(a.id > b.id) {
               return 0
            }
              return -1
        })
    }

    const getDetections = async () => {
        try {
            const detections = await axios.get(`${detectionApi}/GetById/${contextId}`)
            const anomaly = {Id: '2a709381-7140-43a3-8a17-b6e3e246cee93', ContextId: contextId, Description: "hi", DetectionType: 4, DetectionTime: 0.25, Accuracy: 0.99, AnomalySeverity: "Serious"}
            setDetections(convertToPresentation(orderByDetectionTime([...detections.data].filter(detection => detection.DetectionType !== 4 ))))
            setDetectionsAnomaly(convertToPresentation([...detections.data].filter(detection => detection.DetectionType === 4 )))
        } catch (err) {

        }
    }

    const getAggreratedDetections = async () => {
        const groupedDetections = await axios.get(`${groupedDetectionApi}/${contextId}`)
        const otherType = [...groupedDetections.data].filter(detection => detection.DetectionType !== 4)
        const anomalyType = [...groupedDetections.data].filter(detection => detection.DetectionType === 4 )
        const mappedToLastDetection = otherType.map(filtered => filtered.groups.map(filter => filter.last_detection)).flat()
        setDetections(convertToPresentation(mappedToLastDetection))
        setDetectionsAnomaly(convertToPresentation(anomalyType))
    }

    useEffect(async () => {
        //await getDetections()
        await getAggreratedDetections()
    }, [contextId]);


    useEffect(async () => {
        debugger
        if (!userToken || !contextId) {
            return
        }
        const processes = await axios.get(pathUrlProcess, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
             }
         })
        const foundProcess = processes.data.processes.filter(process => process.contextId === contextId)[0]
        debugger
        foundProcess && foundProcess.status === 100 && setFinishProcessing(true)
    }, [userToken, contextId])

    return (
        <Layout>
            {
                contextId && finishProcessing
                ?
                <Fragment>
                    <Helmet
                        bodyAttributes={{
                            class: 'overflow-body'
                        }}
                    />
                    <div className="d-flex flex-row">
                        <div className={`${style.flex_grow_2} p-3`}>
                            <Log videoTime={videoCurrentTime} rows={detectionsAnomaly} headerTitle={`Anomalies:`}/>
                        </div>
                        <div className={`${style.flex_grow_4} p-2`}>
                            <Video videoHeight='100%' videoWidth='100%' videoUrl={videoUrlPostProcessing} setVideoCurrentTime={setVideoCurrentTime}/>
                        </div>
                        <div className={`${style.flex_grow_2} p-3`}>
                            <Log videoTime={videoCurrentTime} rows={detections} headerTitle={`Detections:`}/>
                        </div>
                    </div>
            
                    <div class="toast-container position-absolute p-3 top-10 start-0 show">
                        {feedbackResponses.filter(feedbackResponse => {
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
                </Fragment>
                :
                <Fragment>
                    <div class="home-page"></div>
                    <div style={{"color": "white"}} class="position-absolute top-50 start-50 translate-middle">
                        {
                        !contextId 
                        ? 
                        <h1>Please pick a video to be able to make the analyse.</h1> 
                        :
                        <Fragment>
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border spinner-purple spinner-analyse" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                            <h1>Please wait while we are processing your request.</h1>
                        </Fragment>
                        }
                    </div>
                </Fragment>
            }
        </Layout>
    )
}

export default AnalyseVideo