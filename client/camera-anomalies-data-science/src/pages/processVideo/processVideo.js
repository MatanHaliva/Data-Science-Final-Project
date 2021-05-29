import React, {Fragment, useEffect, useState} from "react"
import axios from "axios"
import { io } from "socket.io-client";
import Progress from "../components/Progress"
import Modal from "../components/Modal"
import { Link } from "gatsby"
import { navigate } from "gatsby"
import { useSelector } from 'react-redux'
import { sleep } from "../../../../../server-files/helper";
import Layout from "../components/Layout";
import Card from "../components/Card";

const endpointStartProcessing = "process"
const endpointCheckStatus = "checkStatus"
const startProcessingVideoUrl = "http://localhost:33345" 


const ProcessVideo = ({contextId, filePath, setFinishProcessing, finishProcessing, setCurrentRoute}) => {
    const [socketProccessing, setSocketProccessing] = useState({})
    const [isStartProcessing, setIsStartProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [intervalCheckStatus, setIntevalCheckStatus] = useState()
    const [cardData, setCarData] = useState([])
    const userToken = useSelector(state => state.login.loggedToken)


    useEffect(() => {
        setCarData([{header: `Processing video page with details`, content: `${contextId ? contextId : "N/A"}`}, { header: `File Path`, content: `${filePath ? filePath : "N/A"}`}])
    }, [contextId, filePath])


    const startProcessing = async () => {
        setProcessingProgress(100)

        try {
            console.log("start processing")
            const res = await axios.post(`${startProcessingVideoUrl}/${endpointStartProcessing}`, { contextId, filePath },  {
                headers: {
                   "Content-Type": "application/json",
                   "Authorization": userToken
                }
            })
            setIsStartProcessing(true)
            
        } catch (err) { 

        }

        // const intervalId = setInterval(async () => {
        //     try {
        //         const res = await axios.post(`${startProcessingVideoUrl}/${endpointCheckStatus}`, { contextId, filePath },  {
        //             headers: {
        //                "Content-Type": "application/json"
        //             }
        //         })
        //         const { processingPercents } = res.data
    
        //         setProcessingProgress(processingPercents)
    
        //         if (processingPercents === 1) {
        //             clearInterval(intervalCheckStatus)
        //             await sleep(500)

                    
        //         }
        //     } catch (err) {
        //         clearInterval(intervalCheckStatus)
        //     }
       
        // }, 500)

        // setIntevalCheckStatus(intervalId)
    }

    useEffect(async () => {
        if(!contextId) {
            await sleep(3500)
            setCurrentRoute(4)
            navigate("/myVideos")
        }
    }, [contextId])

    return (
        <Layout>
        {
            contextId ? 
            <div class="">
                <div class="position-absolute top-50 start-50 translate-middle">
                    <div className="container">
                        <Card rows={cardData} cardHeader={"Upload Video Information"} cardDescription={"Description about the uploaded Video need to process the video and then analyse it."} />
                        <button type="submit" value="Start Processing" className="btn btn-primary btn-block mt-4" onClick={() => startProcessing()} > Start Processing </button>
                        {isStartProcessing ? 
                        (<div>
                            Processing the uploaded video estimated time:
                            <Progress percents={processingProgress}/>
                        </div>) : <div/>}

                        {processingProgress === 100 ?
                            <Fragment>
                                <Modal modalText={"Are you want to proceed for analysing?"} modalTitle={"Finished Processing Successfully"} 
                                onSave={(e) => {
                                    navigate("/analyseVideo")
                                    setCurrentRoute(3)
                                }}
                                onClose={(e) => {
                                    setProcessingProgress(0)
                                    setIsStartProcessing(false)
                                }}/>
                            </Fragment> 
                            :
                            <div/>
                        }
                    </div>
                </div>
            </div>
        :
        <Fragment>
              <div className="position-absolute top-50 start-50 translate-middle">
                    <h4 className="display-7 text-center mb-4">
                        <i className="fab fa-react">You have not picked any uploaded video to process</i>
                    </h4>
                    <h4 className="display-7 text-center mb-4">
                        <i className="fab fa-react">Redirected you to pick a video...</i>
                    </h4>
                </div>
        </Fragment>
        }
        </Layout>
    )

}

export default ProcessVideo