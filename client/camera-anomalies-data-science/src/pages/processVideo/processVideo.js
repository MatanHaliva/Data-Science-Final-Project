import React, {Fragment, useEffect, useState} from "react"
import axios from "axios"
import { io } from "socket.io-client";
import Progress from "../components/Progress"
import Modal from "../components/Modal"
import { Link } from "gatsby"
import { navigate } from "gatsby"

import { sleep } from "../../../../../server-files/helper";
import Layout from "../components/Layout";
import Card from "../components/Card";

const endpointStartProcessing = "process"
const endpointCheckStatus = "checkStatus"
const startProcessingVideoUrl = "http://localhost:5000" 


const ProcessVideo = ({contextId, filePath, setFinishProcessing, finishProcessing, setCurrentRoute}) => {
    const [socketProccessing, setSocketProccessing] = useState({})
    const [isStartProcessing, setIsStartProcessing] = useState(false)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [intervalCheckStatus, setIntevalCheckStatus] = useState()
    const [cardData, setCarData] = useState([])


    useEffect(() => {
        setCarData([{header: `Processing video page with details`, content: `contextId ${contextId}`}, { header: `File Path`, content: `${filePath}`}])
    }, [contextId, filePath])

    const initWebSocketConn = async ({contextId}) => {
        const socket = io("ws://localhost:5000", {transports: ['websocket', 'polling', 'flashsocket']});
        socket.on("connect", () => {
            setSocketProccessing(socket)
            setFinishProcessing(false)
            socket.send({contextId})
        });

        socket.on("message", (data) => {
            if (data.msg === "FINISH_PROCESSING") {
                setFinishProcessing(true)
            }
        });
    }

    const startProcessing = async () => {
        setProcessingProgress(100)

        try {
            console.log("start processing")
            const res = await axios.post(`${startProcessingVideoUrl}/${endpointStartProcessing}`, { contextId, filePath },  {
                headers: {
                   "Content-Type": "application/json"
                }
            })
            const socket = await initWebSocketConn({contextId})
            setIsStartProcessing(true)
            
        } catch (err) { 

        }

        const intervalId = setInterval(async () => {
            try {
                const res = await axios.post(`${startProcessingVideoUrl}/${endpointCheckStatus}`, { contextId, filePath },  {
                    headers: {
                       "Content-Type": "application/json"
                    }
                })
                const { processingPercents } = res.data
    
                setProcessingProgress(processingPercents)
    
                if (processingPercents === 1) {
                    clearInterval(intervalCheckStatus)
                    await sleep(500)

                    
                }
            } catch (err) {
                clearInterval(intervalCheckStatus)
            }
       
        }, 500)

        setIntevalCheckStatus(intervalId)
    }

    return (
        <Layout>
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
                            <Modal modalText={"Are you want to proceed for processing?"} modalTitle={"Upload Passed Successfully"} 
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
        </Layout>
    )

}

export default ProcessVideo