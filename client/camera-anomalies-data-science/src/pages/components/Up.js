import React, { Fragment, useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import uploadVideo from "../uploadVideo"
import CardChild  from "./CardChild"
import Video from "./Video"
import findPage from "../dashboard/helper"

const Up = ({uploadedVideos, pickVideo}) => {
    const endpoint = 'http://localhost:33345'
    const [currentPage, setCurrentPage] = useState(0)
    const numberCardsPerPage = 6
    const contextId = useSelector(state => state.app.contextId)

    useEffect(() => {
        const findPageFormatList = uploadedVideos.map(uploadVideo => ({...uploadVideo, contextId: uploadVideo.id}))
        const pageContextIdExists = findPage(findPageFormatList, contextId, numberCardsPerPage)
        setCurrentPage(pageContextIdExists === -1 ? 0 : pageContextIdExists)
    }, [uploadedVideos])


    const onCardClicked = (uploadedVideoIndex) => {
        const uploadedVideo = uploadedVideos.filter(uploadedVideo => uploadedVideo.id === uploadedVideoIndex)
        pickVideo(uploadedVideo[0].id, uploadedVideo[0].path)
    }

    const getVideos = (uploadedVideos) => {
        const numberPages = Math.ceil(uploadedVideos.length ? uploadedVideos.length / numberCardsPerPage : 0)

        return (
            <Fragment>
                <div>
                    <div class="container-dashboard">
                        {
                            uploadedVideos.slice(currentPage * numberCardsPerPage, currentPage * numberCardsPerPage + numberCardsPerPage).map((uploadedVideo, index) => {
                                return (
                                    <Fragment>
                                        <div class="p-3 bd-highlight" key={uploadedVideo.id}>
                                            <CardChild clickAble={true} index={uploadedVideo.id} picked={uploadedVideo.picked} loading={uploadedVideo.loading} cardHeader={uploadedVideo.header} cardDescription={uploadedVideo.description} width={uploadedVideo.width} height={uploadedVideo.height} onCardClicked={onCardClicked}>
                                                <Video videoUrl={`${endpoint}${uploadedVideo.path}`} videoHeight={'100%'} videoWidth={`100%`}  />
                                                <div>Context Id: {uploadedVideo.id}</div>
                                                <div>File Path: {uploadedVideo.path}</div>
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