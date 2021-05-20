import React, { Fragment, useEffect, useState} from "react"
import CardChild from "../components/CardChild"
import Video from "../components/Video"
import Layout from "../components/Layout"
import Progress from "../components/Progress"
import processVideo from "../processVideo"
import axios from "axios"
import { useSelector } from 'react-redux'


const Dashboard = ({processedVideos}) => {
    const endpoint = 'http://localhost:5000'
    const [timer, setTimer] = useState()
    const [processesVideo, setProcessesVideo] = useState([])
    const pathUrlProcess = `${endpoint}/process`
    const pathUrlUpload = `${endpoint}/upload`
    let userToken = useSelector(state => {
        return state.login.loggedToken
    })
    userToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVsYWRjb29sMEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTYyMTQ1NDQ4Nn0.gUmexu9WI8hm4QDzPLuGpnsTxqI0kGT0mvMOcvcaiELSrt6Nw-ja3vAQCewu3nOCPqvPQuu8XwuoAdZbU_2_yQ"


    const getItems = async (isFirstTime) => {
        const processes = await axios.get(pathUrlProcess, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
             }
         })
        
        if (isFirstTime) {
            const listBefore = processes.data.processes.map(process => {
                return {
                    width: 500,
                    height: 380,
                    path: "123",
                    loading: true
                }
            })
            setProcessesVideo(listBefore)
        } 
        const uploads = await axios.get(pathUrlUpload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
             },
             params: {
                 contextIds: processes.data.processes.map(process => process.contextId)
             }
         })
         const list = processes.data.processes.map(process => {
            return {
                id: process._id,
                header: 'Process',
                description: 'Description ' + process._id,
                width: 500,
                height: 380,
                path: uploads.data.uploads.filter(upload => upload.contextId === process.contextId)[0].filePath,
                status: process.status,
                loading: false
            }
        })
        setProcessesVideo(list)
        clearTimeout(timer)
        const timer = setTimeout(async () => await getItems(false), 1)
        setTimer(timer)
    }

    useEffect(async () => {
        await getItems(true)
        setTimer(timer)

    }, [])

    return (
        <Layout>
            <div class="d-flex flex-column bd-highlight mb-3 flex-fill">
                <div className="container">
                                        <h4 className="display-4 text-center mb-4">
                                            <i className="fab fa-react">My Processing</i>
                                        </h4>
                        
                    {   
                        processesVideo.map(processedVideo => {
                            console.log("processedVideo", processedVideo)
                            const pathUrl = `${endpoint}${processedVideo.path}`

                            return(
                                <Fragment key={processedVideo.id}>
                                        <div class="p-3 bd-highlight">
                                        <CardChild loading={processedVideo.loading} cardHeader={processedVideo.header} cardDescription={processedVideo.description} width={processedVideo.width} height={processedVideo.height}>
                                            <Video videoUrl={pathUrl} videoHeight={`${processedVideo.height - 100}px`} videoWidth={`${processedVideo.width - 200}px`}  />
                                            {processedVideo.status === 100 ? <h8>Finished Processing</h8> : <Progress percents={processedVideo.status}/>}
                                        </CardChild>
                                        </div>
                                </Fragment>
                            )
                    
                        })
                    }
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard