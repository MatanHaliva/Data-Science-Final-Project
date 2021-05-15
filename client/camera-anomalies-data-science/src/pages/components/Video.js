import React, {Fragment, useState, useEffect  } from "react"


const Video = ({videoUrl, setVideoCurrentTime}) => {
    const [a, setA] = useState(5)

    useEffect(() => {
        const elem = document.querySelector("video");
        elem.addEventListener("timeupdate", () => {
            setVideoCurrentTime(elem.currentTime)
        })
    }, [a])

    return (
        <Fragment>
            <video width="1000px" height="500px" controls>
                <source src={videoUrl} type="video/mp4" />
            </video>
        </Fragment>
    )
}

export default Video