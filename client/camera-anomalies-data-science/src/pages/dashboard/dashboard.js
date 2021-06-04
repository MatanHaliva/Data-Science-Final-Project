import React, { Fragment, useEffect, useState, useRef} from "react"
import CardChild from "../components/CardChild"
import Video from "../components/Video"
import Layout from "../components/Layout"
import Progress from "../components/Progress"
import processVideo from "../processVideo"
import axios from "axios"
import { useSelector } from 'react-redux'
import { sleep } from "../../../../../server-files/helper"
import findPage from "./helper"

const Dashboard = ({}) => {
    const numberCardsPerPage = 6
    const endpoint = 'http://localhost:33345'
    const [processesVideo, setProcessesVideo] = useState([])
    const [rawProcessesVideo, setRawProcessesVideo] = useState([])
    const [rawUploads, setRawUploads] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [numberPages, setNumberPages] = useState(6)

    const [loading, setLoading] = useState(false)
    const pathUrlProcess = `${endpoint}/process`
    const pathUrlUpload = `${endpoint}/upload`
    let userToken = useSelector(state => {
        return state.login.loggedToken
    })
    const contextId = useSelector(state => {
        return state.app.contextId
    })

    const processesForEver = useRef()
    const timer = useRef()

    const getProcesses = async () => {
        if (!userToken) {
            return
        }
        const processes = await axios.get(pathUrlProcess, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
             }
         })
        setRawProcessesVideo([...processes.data.processes])

        const list = processes.data.processes.map(process => {
            const uploadForProcess = rawUploads.filter(upload => upload.contextId === process.contextId)[0]
            return {
                contextId: process.contextId,
                id: process._id,
                header: 'Process',
                description: 'Description ' + process._id,
                width: 500,
                height: 380,
                path: uploadForProcess ? uploadForProcess.filePath : "",
                status: process.status,
                loading: false
            }
        })
        setProcessesVideo(list)
        clearTimeout(timer.current)
        const currentTimer = setTimeout(async () => await getProcesses(), 1000)
        timer.current = currentTimer
    }

    const getUploads = async () => {
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
        const listBefore = uploads.data.uploads.map(upload => {
            return {
                width: 500,
                height: 380,
                path: upload.filePath,
                loading: true
            }
        })
        setProcessesVideo(listBefore)
        setRawUploads([...uploads.data.uploads])
        setLoading(false)
    }

    useEffect(async () => {
        await getProcesses()
    }, [rawUploads])

    useEffect(async () => {
        await getUploads()
    }, [userToken])

    useEffect(() => {
        return () => {
            timer.current && clearTimeout(timer.current)
        }
    },[])

    useEffect(() => {
        const pageContextIdExists = findPage(processesVideo, contextId, numberCardsPerPage)
        setCurrentPage(pageContextIdExists === -1 ? 0 : pageContextIdExists)
    }, [processesVideo])

    useEffect(async () => {
        setNumberPages(Math.ceil(processesVideo.length ? processesVideo.length / numberCardsPerPage : 0))
    }, [processesVideo])

    return (
        <Layout>
            <div class="d-flex flex-column bd-highlight mb-3 flex-fill">
                <div className="">
                    <h4 className="display-4 text-center mb-4 header-my-processing">
                        <i className="fab fa-react">My Processing</i>
                    </h4>
                    <div>
                        {   
                            loading ? 
                            <Fragment>
                                <div className="loading-spinner position-absolute top-50 start-50 translate-middle">
                                    <div class="spinner-border text-secondary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </Fragment> :
                            processesVideo.length === 0 ?
                            <Fragment>
                                <div className="position-absolute top-50 start-50 translate-middle">
                                    <h5 className="display-7 text-center mb-4">
                                        <i className="fab fa-react">You have no processing videos...</i>
                                    </h5>
                                </div>
                            </Fragment> :
                            <Fragment>
                                <div className="container-dashboard">
                                    {
                                        processesVideo.slice(currentPage * numberCardsPerPage, currentPage * numberCardsPerPage + numberCardsPerPage).map(processedVideo => {
                                            const pathUrl = `${endpoint}${processedVideo.path}`
            
                                            return(
                                                <Fragment key={processedVideo.id}>
                                                        <div class="p-3 bd-highlight">
                                                        <CardChild clickAble={false} loading={processedVideo.loading} cardHeader={processedVideo.header} cardDescription={processedVideo.description} width={processedVideo.width} height={processedVideo.height}>
                                                            <Video videoUrl={pathUrl} videoHeight={`${processedVideo.height - 100}px`} videoWidth={`${processedVideo.width - 200}px`}  />
                                                            {processedVideo.status === 100 ? <h6>Finished Processing</h6> : processedVideo.status === 0 ? <h6>Did not start Processing</h6> : <Progress percents={processedVideo.status}/>}
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
                            </Fragment>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard