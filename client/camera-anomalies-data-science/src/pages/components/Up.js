import React, { Fragment, useEffect, useState} from "react"
import CardChild  from "./CardChild"
import Video from "./Video"

const Up = ({uploadedVideos, pickVideo}) => {
    const endpoint = 'http://localhost:33345'

    const getVideos = (uploadedVideos) => {
        return uploadedVideos.map(uploadedVideo => {
            return (
                <Fragment>
                    <div class="p-3 bd-highlight" key={uploadedVideo.id}>
                        <CardChild picked={uploadedVideo.picked} loading={uploadedVideo.loading} cardHeader={uploadedVideo.header} cardDescription={uploadedVideo.description} width={uploadedVideo.width} height={uploadedVideo.height}>
                            <Video videoUrl={`${endpoint}${uploadedVideo.path}`} videoHeight={`${uploadedVideo.height - 100}px`} videoWidth={`${uploadedVideo.width - 200}px`}  />
                            <button value="Pick Video" className="btn btn-primary btn-block mt-4" onClick={() => pickVideo(uploadedVideo.id, uploadedVideo.path)} > Pick Video </button>
                        </CardChild>
                    </div>
                </Fragment>
            )
        })
    }

    return (
    <div className="container-dashboard">
        {getVideos(uploadedVideos)}
    </div>
    )
}

export default Up