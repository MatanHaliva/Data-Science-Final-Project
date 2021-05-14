import React, {Fragment, useState} from "react"
import axios from "axios"
import { io } from "socket.io-client";


const endpoint = "process"
const startProcessingVideoUrl = "http://localhost:5000" 


const ProcessVideo = ({contextId, filePath, setFinishProcessing, finishProcessing}) => {
    const [socketProccessing, setSocketProccessing] = useState({})
    const [isStartProcessing, setIsStartProcessing] = useState(false)

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
        try {
            console.log("start processing")
            const res = await axios.post(`${startProcessingVideoUrl}/${endpoint}`, { contextId, filePath },  {
                headers: {
                   "Content-Type": "application/json"
                }
            })
            const socket = await initWebSocketConn({contextId})
            setIsStartProcessing(true)
            
        } catch (err) { 

        }
    }

    return (
        <Fragment>
            <div>Processing video page with details: contextId: {contextId}, filePath: {filePath}</div>
            <button type="submit" value="Start Processing" className="btn btn-primary btn-block mt-4" onClick={() => startProcessing()} > Start Processing </button>
            {isStartProcessing ? (<div>
                processing 
                </div>) : <div/>}
        </Fragment>
    )

}

export default ProcessVideo