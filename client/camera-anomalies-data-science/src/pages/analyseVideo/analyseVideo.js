import React, {Fragment, useState, useEffect  } from "react"
import Video from "../components/Video"
import Log from "../components/Log"
import axios from 'axios'
import * as style from "./index.module.css"
import Layout from "../components/Layout"
import { detectionTypes } from "../../shared/detectionTypes"

const AnalyseVideo = ({contextId, filePath, setVideoCurrentTime, videoCurrentTime}) => {
    const videoUrl = `http://localhost:33345${filePath}`
    const detectionApi = `https://detections-api.azurewebsites.net/Detections`
    const [detections, setDetections] = useState([])
    const [videoTime, setVideoTime] = useState({})

    const convertToPresentation = (detections) => {
        return detections.map(detection => {
            return {
                id: detection.ContextId,
                description: detection.Description,
                detectionType: detectionTypes[detection.DetectionType],
                detectionTime: detection.DetectionTime,
                Accuracy: detection.Accuracy
            }
        })
    }

    const getDetections = async () => {
        console.log(contextId)
        const detections = await axios.get(`${detectionApi}/GetById/${contextId}`)

        setDetections(convertToPresentation(detections.data))
    }

    useEffect(() => {
        getDetections()
    }, [contextId]);

    return (
        <Layout>
            <div className="d-flex flex-row">
                <div className={`${style.flex_grow_4} p-2`}>
                    <Video videoUrl={videoUrl} setVideoCurrentTime={setVideoCurrentTime}/>
                </div>
                <div className={`${style.flex_grow_2} p-2`}>
                    <Log videoTime={videoCurrentTime} rows={detections}/>
                </div>
            </div>
      
        </Layout>
    )
}

export default AnalyseVideo