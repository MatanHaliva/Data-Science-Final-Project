import React, { Fragment, useEffect, useState} from "react"
import CardChild  from "./CardChild"
import Video from "./Video"

const Up = ({uploadedVideos, pickVideo}) => {
    const endpoint = 'http://localhost:33345'
    const [currentPage, setCurrentPage] = useState(0)

    const getVideos = (uploadedVideos) => {
        const numberCardsPerPage = 6
        const numberPages = Math.round(uploadedVideos.length ? uploadedVideos.length / numberCardsPerPage : 0)
        console.log('num', numberPages)

        return (
            <Fragment>
                <div>
                    <div class="container-dashboard">
                        {
                            uploadedVideos.slice(currentPage * numberCardsPerPage, currentPage * numberCardsPerPage + numberCardsPerPage).map(uploadedVideo => {
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
                    </div>
                    <nav className="pagination-navbar" aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                            {
                                [...Array(numberPages).keys()].map(num => {
                                    return (<li className={`page-item ${num === currentPage ? 'active': ''}`} ><a class="page-link" onClick={(e) => setCurrentPage(num)} href="#">{num}</a></li>)
                                
                                }) 
                            }
                            <li class="page-item"><a class="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>
                </div>
                
            </Fragment>
        )
    }

    return (
    <div className="container-dashboard">
        {getVideos(uploadedVideos)}
    </div>
    )
}

export default Up