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
        const filteredList = detections.filter(detection => detection.show === 'show')
        const listLength = filteredList.length - 1
        return detections.filter(detection => detection.show === 'show').map((detection, index) => {
            return (
                <LogToast toastShowFade={`toast ${detection.show} fade ${index === listLength ? 'last-toast' : ''}`} {...detection} key={detection.id}/>
            )
        })
    }

    return (
        <Fragment>
            <div className="header-alerts">
                <h2 className="header-alerts">Alerts: </h2>
            </div>
            <Fragment>
                {
                    createToasts()
                }
            </Fragment>
        </Fragment>
    )
}

export default Log