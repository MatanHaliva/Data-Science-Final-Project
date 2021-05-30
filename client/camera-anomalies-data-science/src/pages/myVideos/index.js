import React, { Fragment, useEffect, useState } from "react"
import Layout from "../components/Layout"
import { setContextId, setFilePath } from "../../redux/actions"
import { useDispatch, useSelector } from "react-redux"
import Up from "../components/Up"
import axios from "axios"

const MyVideos = () => {
    const [uploads, setUploads] = useState([])
    const [loading, setLoading] = useState(false)
    const endpoint = 'http://localhost:33345'
    const dispatch = useDispatch()
    const pathUrlUpload = `${endpoint}/upload`
    let userToken = useSelector(state => {
        return state.login.loggedToken
    })
    let contextId = useSelector(state => {
        return state.app.contextId
    })


    const isPicked = (currentContextId) => {
        return contextId === currentContextId
    }

    const pickVideo = (contextId, filePath) => {
        dispatch(setContextId(contextId))
        dispatch(setFilePath(filePath))
    }

    const fetchVideos = async () => {
        setLoading(true)
        if (!userToken) {
            return
        }
        const uploads = await axios.get(pathUrlUpload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
             },
             params: {
                 contextIds: []
             }
         })

        setUploads(uploads.data.uploads.map(upload => {
            return {
                id: upload.contextId,
                header: 'Upload',
                description: 'Description ' + upload.contextId,
                width: 500,
                height: 380,
                path: upload.filePath,
                loading: false,
                picked: isPicked(upload.contextId)
            }
        }))
        setLoading(false)
    }

    useEffect(() => {
        fetchVideos()
    }, [userToken])


    useEffect(() => {
        setUploads(uploads.map(upload => ({...upload, picked: isPicked(upload.id)})))
    }, [contextId])

    return (
        <Layout>
            <div class="d-flex flex-column bd-highlight mb-3 flex-fill">
                <div className="">
                    <h4 className="display-4 text-center mb-4">
                        <i className="fab fa-react">My Uploaded Videos</i>
                    </h4>
                    {
                        loading ? <div className="loading-spinner position-absolute top-50 start-50 translate-middle">
                        <div class="spinner-border text-secondary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div> : uploads.length === 0 ? 
                        <Fragment>
                            <div className="position-absolute top-50 start-50 translate-middle">
                                <h5 className="display-7 text-center mb-4">
                                    <i className="fab fa-react">You have no videos...</i>
                                </h5>
                            </div>
                        </Fragment>
                        :
                        <Up uploadedVideos={uploads} pickVideo={pickVideo}/>
                    }
                    
                </div>
            </div>
        </Layout>
    )
}

export default MyVideos