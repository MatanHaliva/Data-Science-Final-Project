import React, {Fragment, useState, useEffect  } from "react"


const Video = ({videoUrl, setVideoCurrentTime, videoHeight, videoWidth}) => {
    const defaultHeight = '100%'
    const defaultWidth = '100%'

    useEffect(() => {
        if (typeof setVideoCurrentTime === 'function') {
            const elem = document.querySelector("video");

            elem.addEventListener("timeupdate", () => {
                setVideoCurrentTime(elem.currentTime)
            })
        }
    }, [])

    return (
        <Fragment>
            <video height={videoHeight ? videoHeight : defaultHeight} width={videoWidth ? videoWidth : defaultWidth} controls muted>
                <source src={videoUrl} type="video/mp4" />
            </video>
        </Fragment>
    )
}

export default Video