import React, { Fragment, useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import Layout from "../components/Layout"
import {getImagePath} from "../analyseVideo/helper"
import { detectionTypes, detectionTypesName } from "../../shared/detectionTypes"
import { sleep } from "../../../../../server-files/helper"

const URL = 'https://jsonplaceholder.typicode.com/users'
const detectionApi = `https://detections-api20210802233301.azurewebsites.net/Detections`

const FeedbackTable = () => {
    const [detections, setDetections] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [error, setError] = useState({isError: false})
    const [numberPages, setNumberPages] = useState(3)
    const [buttonPagination, setButtonPagination] = useState([...Array(3)])
    const [detectionTypeFilter, setDetectionTypeFilter] = useState(0)
    const [startFilter, setStartFilter] = useState(0)
    const [endFilter, setEndFilter] = useState(Number.MAX_VALUE)
    const [accuracyThreshold, setAccuracyThreshold] = useState(0)

    const contextId = useSelector(state => state.app.contextId)
    const numberCardsPerPage = 11
    const eachSideButtons = 2
    const numberForward = 5

    useEffect(async () => {
        if(contextId) {
            await getData()
        } else {
            setError({isError: true, errorMessage: "No Context Id please pick a video"})
        }
       
    }, [contextId])

    useEffect(() => {
        const numberPages = Math.ceil(getDetections().length ? getDetections().length / numberCardsPerPage : 0)
        setNumberPages(numberPages)
    })

    useEffect(() => {
        setCurrentPage(0)
    }, [accuracyThreshold, startFilter, endFilter, detectionTypeFilter])

    const convertToPresentation = (detections) => {
        return detections.map(detection => {
            return {
                id: detection.Id,
                contextId: detection.ContextId,
                description: detection.Description,
                detectionTypeName: detectionTypes[detection.DetectionType],
                detectionType: detection.DetectionType,
                detectionTime: Math.round((detection.DetectionTime + Number.EPSILON) * 100) / 100,
                accuracy: detection.Accuracy,
                licensePlate: detection.LicensePlate,
                manufacturer: detection.Manufacturer,
                color: detection.Color,
                img: getImagePath(detection),
                faceId: detection.FaceId,
                severity: detection.AnomalySeverity
            }
        })
    }

    const getData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${detectionApi}/GetById/${contextId}`)
            setDetections(convertToPresentation([...response.data]))

            setLoading(false)
        } catch (err) {
            debugger
            setError({isError: true, errorMessage: err})
        }
    }

    const removeData = (id) => {

        axios.delete(`${URL}/${id}`).then(res => {
            const del = detections.filter(employee => id !== employee.id)
            setDetections(del)
        })
    }

    const renderHeader = () => {
        let headerElement = ['#', 'Id', 'Context Id', 'Description', 'Detection Type', 'Detection Time', 'Accuracy', 'License Plate', 'Manufacturer', 'Color', 'Img', 'FaceId', 'Severity', 'Operation']

        return headerElement.map((key, index) => {
            return <th key={index}>{key}</th>
        })
    }

    const getDetections = () => {
        return detections &&
        detections.
        filter(detection => detection.detectionType === detectionTypeFilter).
        filter(detection => detection.detectionTime >= startFilter && detection.detectionTime <= endFilter).
        filter(detection => detection.accuracy >= accuracyThreshold)
    }

    const onChangeStart = (e) => {
        setStartFilter(e.target.value)
    }

    const onChangeEnd = (e) => {
        setEndFilter(e.target.value)
    }

    const onChangeAccuracyThreshold = (e) => {
        setAccuracyThreshold(e.target.value / 100)
    }

    useEffect(() => {
        const arr = decideNumberButtons()
        setButtonPagination(arr)
    }, [currentPage])

    const decideNumberButtons = () => {
        const realCurrentPage = currentPage <= 0 ? 0 : currentPage

        let leftSide
        if (realCurrentPage - eachSideButtons < 0) {
            leftSide = realCurrentPage - (realCurrentPage % eachSideButtons)
        } else {
            leftSide = realCurrentPage - eachSideButtons
        }
        let rightSide
        if (realCurrentPage + eachSideButtons > numberPages) {
            rightSide = realCurrentPage + eachSideButtons - numberPages
        } else {
            rightSide = realCurrentPage + eachSideButtons
        }

        setCurrentPage(realCurrentPage)

        debugger

        const arr = [...Array(numberPages).keys()].slice(leftSide, rightSide + 1)

        debugger

        return arr
    }


    const renderBody = () => {
        return getDetections() && getDetections().slice(currentPage * numberCardsPerPage, currentPage * numberCardsPerPage + numberCardsPerPage).map(({ id, contextId, description, detectionTypeName, detectionType, detectionTime, accuracy, licensePlate, manufacturer, color, img, faceId, severity }, index) => {
            return (
                <tr align="center" key={id}>
                    <td>{(index + 1) + (currentPage * numberCardsPerPage)}.</td>
                    <td>{id.slice(id.length - 10, id.length)}</td>
                    <td>{contextId.slice(0,12)}</td>
                    <td>{description.slice(0,12)}</td>
                    <td>{detectionTypeName}</td>
                    <td>{detectionTime}</td>
                    <td>{accuracy * 100}%</td>
                    <td>{licensePlate ? licensePlate.slice(0,12) : "N/A"}</td>
                    <td>{manufacturer ? manufacturer.slice(0,12) : "N/A" }</td>
                    <td>{color ? color.slice(0,5) : "N/A"}</td>
                    <td><img width="55px" height="55px" src={img}/></td>
                    <td>{faceId ? faceId.slice(0,5) : "N/A"}</td>
                    <td>{severity ? severity : "N/A"}</td>
                    <td className='opration-feedback-table'>
                        <button className='button-feedback-table' onClick={() => removeData(id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    const createFilter = () => {
        return (
            <table style={{'margin': '5px 80px 15px 80px'}} id="filter">
            <thead>
              <tr>
                <th>
                <div className="filter-flex">
                    <div>
                        <div>Pick Type:</div>
                        <select id="assigned-user-filter" class="form-control" onChange={(e) => {
                            setDetectionTypeFilter(detectionTypesName[e.target.value])}}>
                            <option>Car Detections</option>
                            <option>Face Detections</option>
                            <option>Anomaly Detections</option>
                        </select>
                    </div>        
                    <div>  
                        <label for="customRange1" class="form-label">Accuracy Threshold: {accuracyThreshold * 100}% </label>
                        <input type="range" class="form-range" id="customRange1" onChange={onChangeAccuracyThreshold}></input>
                    </div>
                    <div className="between-filter">
                        <div>Video Time start:</div> <input class="file-input" id="customFile" onChange={onChangeStart} type="text"/>
                    </div>
                    <div className="between-filter">
                        <div>Video Time end:</div> <input class="file-input" id="customFile" onChange={onChangeEnd} type="text"/>
                    </div>
                </div>
                </th>
              </tr>
            </thead>
          </table>
        )
    }

    return (
        <Layout>
            <div className="d-flex flex-column">
            {
            !error.isError
            ?
                <Fragment>
                    <h1 id='title' style={{'color': 'white', 'padding': '15px'}}>Detections Table</h1>
                    {createFilter()}
                    <table style={{'margin': '5px 80px 15px 80px'}} id='employee'>
                        <thead>
                            <tr>{renderHeader()}</tr>
                        </thead>
                        {loading ? <div class="d-flex justify-content-center">
                                        <div class="spinner-border spinner-purple" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>: !!getDetections().length && getDetections().length > 0 ? <tbody>{renderBody()}</tbody> : <tbody><div style={{"color": "white"}}>No results...</div></tbody>
                        }
                    </table>
                    <nav className="pagination-navbar" aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item"><a onClick={() => setCurrentPage(currentPage - numberForward)} class="page-link" href="#">{`<<<`}</a></li>
                            <li class="page-item"><a onClick={() => setCurrentPage(currentPage - 1)} class="page-link" href="#">Previous</a></li>
                            {
                                buttonPagination.map(num => {
                                    return (<li className={`page-item ${num === currentPage ? 'active': ''}`} ><a class="page-link" onClick={(e) => setCurrentPage(num)} href="#">{num}</a></li>)
                                }) 
                            }
                            <li class="page-item"><a onClick={() => setCurrentPage(currentPage + 1)} class="page-link" href="#">Next</a></li>
                            <li class="page-item"><a onClick={() => setCurrentPage(currentPage + numberForward)} class="page-link" href="#">{`>>>`}</a></li>
                        </ul>
                    </nav>
                </Fragment>
            :
                <Fragment>
                    <div style={{"color": "white"}} className="position-absolute top-50 start-50 translate-middle">
                        <h1><strong>Failed to Load detections due to:</strong></h1>
                        <h4><strong>{error.errorMessage}</strong></h4>
                    </div>
                </Fragment>
            }
            </div>
        </Layout>
        
    )
}


export default FeedbackTable