import React, {Fragment, useState, useEffect  } from "react"
import Video from "../components/Video"
import Log from "../components/Log"
import axios from 'axios'
import * as style from "./index.module.css"
import Layout from "../components/Layout"
import { detectionTypes } from "../../shared/detectionTypes"

const AnalyseVideo = ({contextId, filePath, setVideoCurrentTime, videoCurrentTime}) => {
    const videoUrl = `http://localhost:33345${filePath}`
    const detectionApi = `http://localhost:5005`
    const [detections, setDetections] = useState([])
    const [videoTime, setVideoTime] = useState({})

    const convertToPresentation = (detections) => {
        return detections.map(detection => {
            return {
                id: detection.contextId,
                description: detection.description,
                detectionType: detectionTypes[detection.detectionType],
                detectionTime: detection.detectionTime,
                Accuracy: detection.Accuracy
            }
        })
    }

    const getDetections = async () => {
        const detections = await axios.get(`${detectionApi}/getByContextId/${contextId}`)

        setDetections(convertToPresentation(detections))
        //setDetections([{id: 1, description: "car moved", detectionTime: 0.2, detectionType: "car movment", accuracy: 0.9}, {id: 2, description: "car color blue", detectionTime: 3, detectionType: "car color", accuracy: 0.6}, {id: 3, description: "car color blue", detectionTime: 4, detectionType: "car color", accuracy: 0.6}])
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