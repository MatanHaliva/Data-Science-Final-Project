import React, {Fragment, useEffect, useState} from "react"
import axios from "axios"
import Progress from "../components/Progress"
import Modal from "../components/Modal"
import { navigate } from "gatsby"
import { useSelector } from 'react-redux'
import { sleep } from "../../../../../server-files/helper";
import Layout from "../components/Layout";

const endpointStartProcessing = "process"
const endpointCheckStatus = "checkStatus"
const startProcessingVideoUrl = "http://localhost:33345" 

const Card = ({contextId, filePath, setCurrentRoute, cardHeader, cardDescription}) => {
    const [isStartProcessing, setIsStartProcessing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [carData, setCarData] = useState([])
    const userToken = useSelector(state => state.login.loggedToken)


    useEffect(() => {
        setCarData([{header: `Processing video page with details`, content: `${contextId ? contextId : "N/A"}`}, { header: `File Path`, content: `${filePath ? filePath : "N/A"}`}])
    }, [contextId, filePath])


    const startProcessing = async () => {
        try {
            setLoading(true)
            console.log("start processing")
            const res = await axios.post(`${startProcessingVideoUrl}/${endpointStartProcessing}`, { contextId, filePath },  {
                headers: {
                   "Content-Type": "application/json",
                   "Authorization": userToken
                }
            })
            console.log("log")
            setIsStartProcessing(true)
            setLoading(false)
        } catch (err) { 

        }
    }

    return (
        <Fragment>
        <div class="landing-page">
            {
                isStartProcessing 
                ? 
                (
                <div class="position-absolute top-50 start-50 translate-middle first-level">
                    <Modal modalText={"Are you want to proceed for analysing?"} modalTitle={"Finished Processing Successfully"} 
                    onSave={(e) => {
                        navigate("/dashboard")
                        setCurrentRoute(5)
                    }}
                    onClose={(e) => {
                        setIsStartProcessing(false)
                    }}/>
                </div>   
                ) 
                : 
                <Fragment/>
            }    
            <div class="container-card-process">
                <div class="info-processing">
                    <h1 style={{'color': '#dcc28e !important'}}>{cardHeader}</h1>
                    <p style={{'color': 'white !important'}}>{cardDescription}</p>
                    <div className="info-picked-processed-video">
                    {
                        carData.map(row => {
                            return (
                            <li class="list-group-item"> 
                                <span><h4>{row.header}:</h4> <h7>{row.content}</h7></span>
                            </li>)
                        })
                    }
                    </div>
                    <div class="start-process">
                        <button type="submit" value="Start Processing" className="btn btn-primary btn-block mt-4" onClick={() => startProcessing()} > Start Processing </button>
                        {loading ? <div className="loading-spinner">
                                <div class="spinner-border spinner-purple" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div> : <Fragment/>}
                    </div>
                </div>
                <div class="image-card-process">
                    <img src="/logo.jpeg"/>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        </Fragment>
    )  
}

export default Card