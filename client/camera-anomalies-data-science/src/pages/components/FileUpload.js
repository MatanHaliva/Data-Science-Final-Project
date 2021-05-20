import React, {Fragment, useState} from "react"
import Progress from './Progress'
import axios from 'axios'
import Modal from "./Modal"
import { Link } from "gatsby"
import { navigate } from "gatsby"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const FileUpload = ({ contextId, count, increment, setContextId, setFilePath, setCurrentRoute}) => {
    const [file, setFile] = useState()
    const [filename, setFilename] = useState('Choose File')
    const [uploadedFile, setUploadedFile] = useState({isPassed: false})
    const [errorUploadingFile, setErrorUploadingFile] = useState({})
    const [loading, setLoading] = useState(false)
    const [uploadPercentage, setUploadPercentage] = useState(0)

    const onChange = e => {
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const onSubmit = async e => {
        setLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append('file', file)

        try {
            console.log("start uploading")
            const res = await axios.post('http://127.0.0.1:5000/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onDownloadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    setUploadPercentage(Math.round(loaded * 100 / total))
                }
            })
            
            const { fileName, filePath, contextId } = res.data

            await sleep(1200)
            setUploadPercentage(0)
            
            setUploadedFile({ fileName, filePath, contextId, isPassed: true })
            setContextId(contextId)
            setFilePath(filePath)

        } catch (err) {
            if (err && err.response && err.response.status === 500) {
                console.log('There was an internal error processing the file')
                setErrorUploadingFile({msg: 'There was an internal error processing the file' })
            } else {
                setErrorUploadingFile({ msg: err.response.data.msg })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Fragment>
            <form onSubmit={onSubmit} className="form">
                <div className="custom-file mb-4">
                    <input className="form-control" type="file" id="customFile" onChange={onChange} />
                    <label htmlFor="customFile" className="form-label"> {filename} </label>
                </div>
                <Progress percents={uploadPercentage}/>

                {loading ? <div>Loading ...</div> : <div></div>}

                <input disabled={!file} type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />

                {uploadedFile.isPassed ? 
                    <Fragment>
                        <Modal modalText={"Are you want to proceed for processing?"} modalTitle={"Upload Passed Successfully"} 
                        onSave={(e) => {
                            navigate("/processVideo")
                            setCurrentRoute(2)
                        }}
                        onClose={(e) => {
                            setUploadedFile({ ...uploadedFile, isPassed: false})
                        }}/>
                    </Fragment>
                    
                : 
                <div>{errorUploadingFile && errorUploadingFile.msg}</div>}
            </form>

       

        </Fragment>
    )
}

export default FileUpload