import React, {Fragment, useState, useEffect  } from "react"
import LogToast from "../components/LogToast"
import * as style from "./css/LogToast.module.css"

const Log = ({rows, videoTime}) => {
    const [detections, setDetections] = useState([])
    const [logTTL, setLogTTL] = useState(50)

    useEffect(() => {
        console.log("rows", rows)
        setDetections(getLogs(rows))
        console.log(detections)
        console.log(videoTime)
    }, [videoTime])

    const getLogs = logs => {
        return logs.map(log => {
            if(log.detectionTime <= videoTime && videoTime - log.detectionTime < logTTL) {
                return {...log, show: `show`}
            } else {
                return {...log, show: `hide`}
            }
        })
    }

    const createToasts = () => {
        return detections.map((detection, index) => {
            return (
                <LogToast toastShowFade={`toast ${detection.show} fade ${index === detections.length - 1 ? 'last-toast' : ''}`} {...detection} key={detection.id}/>
            )
        })
    }

    return (
        <Fragment>
            <h2>Alerts: </h2>
            <Fragment>
                {
                    createToasts()
                }
            </Fragment>
        </Fragment>
    )
}

export default Log