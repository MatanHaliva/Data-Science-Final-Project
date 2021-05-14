import React, {Fragment, useState, useEffect  } from "react"
import LogToast from "../components/LogToast"

const Log = ({rows, videoTime}) => {
    const [detections, setDetections] = useState([])

    useEffect(() => {
        console.log("rows", rows)
        setDetections(getLogs(rows))
        console.log(detections)
        console.log(videoTime)
    }, [videoTime])

    const getLogs = logs => {
        return logs.filter(log => log.detectionTime <= videoTime).filter(log => videoTime - log.detectionTime < 10)
    }

    const createToasts = () => {
        return detections.map(detection => {
            return (
                <LogToast {...detection} key={detection.id}/>
            )
        })
    }

    return (
        <Fragment>
            <h2>Logs: </h2>
            <div>
                {
                    createToasts()
                }
            </div>
        </Fragment>
    )
}

export default Log