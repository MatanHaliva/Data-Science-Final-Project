import React, {Fragment, useState, useEffect  } from "react"
import axios from 'axios'

const AnalyseVideo = ({filePath}) => {
    const videoUrl = `http://localhost:5000${filePath}`
    const detections = [{id: 1, value: 1, detectionTime: 0}, {id: 2, value: 2, relativeTime: 1}, {id: 3, value: 3, relativeTime: 2}, {id: 4, value: 4, relativeTime: 3}]

    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${1} times`;
      });

    return (
        <Fragment>
            <div className="container">
                <video width="1000" height="500" controls>
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <div>logs: </div>
                <div>
                    {
                    detections.map(detection => (<div key={detection.id}>{detection.value}</div>))
                    }
                </div>
            </div>
      
        </Fragment>
    )
}

export default AnalyseVideo