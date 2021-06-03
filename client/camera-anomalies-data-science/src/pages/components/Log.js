import React, {Fragment, useState, useEffect  } from "react"
import LogToast from "../components/LogToast"
import * as style from "./css/LogToast.module.css"

const Log = ({rows, videoTime}) => {
    const [detections, setDetections] = useState([])

    useEffect(() => {
        console.log("rows", rows)
        setDetections(getLogs(rows))
        console.log(detections)
        console.log(videoTime)
    }, [videoTime])

    const getLogs = logs => {
        return logs.map(log => {
            if(log.detectionTime <= videoTime && videoTime - log.detectionTime < 10) {
                return {...log, show: `show`}
            } else {
                return {...log, show: `hide`}
            }
        })
    }

    const createToasts = () => {
        return detections.map(detection => {
            return (
                <LogToast toastShowFade={`toast ${detection.show} fade`} {...detection} key={detection.id}/>
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