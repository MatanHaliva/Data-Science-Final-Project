import React, {Fragment, useEffect, useState} from "react"
import Progress from './Progress'
import axios from 'axios'
import Modal from "./Modal"
import { Link } from "gatsby"
import { navigate } from "gatsby"
import { useSelector } from "react-redux"
import { FaFileUpload } from 'react-icons/fa';

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
    let userToken = useSelector(state => {
        return state.login.loggedToken
    })

    useEffect(() => {
        debugger
        window.supportDrag = function() {
            let div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
        }();
        
        let input =  document.getElementById('customFile');
        
        if(!window.supportDrag){
            document.querySelectorAll('.has-drag')[0].classList.remove('has-drag');
        }
        
        input.addEventListener("change", function(e){      
            document.getElementById('js-file-name').innerHTML = this.files[0].name;     
            document.querySelectorAll('.file-input')[0].classList.remove('file-input--active');
        }, false);
        
        if(window.supportDrag){   
            input.addEventListener("dragenter", function(e) {
            document.querySelectorAll('.file-input')[0].classList.add('file-input--active');
            });

            input.addEventListener("dragleave", function(e) {
            document.querySelectorAll('.file-input')[0].classList.remove('file-input--active');
            });
        }
    }, [{}])

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
            const res = await axios.post('http://127.0.0.1:33345/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": userToken
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
                {/* <div className="custom-file mb-4">
                    <input className="form-control" type="file" id="customFile" onChange={onChange} />
                    <label htmlFor="customFile" className="form-label"> {filename} </label>
                </div>
                <Progress percents={uploadPercentage}/>

                {loading ? <div>Loading ...</div> : <div></div>} */}


                <div class="file-container">
                    <div class=""></div>
                    <div class="file-wrapper">
                        <input class="file-input" id="customFile" onChange={onChange} type="file"/>
                        <div class="file-content">
                        <div class="file-infos">
                            <p class="file-icon"><FaFileUpload size={100}/><span class="icon-shadow"></span><span>Click to browse<span class="has-drag">or drop file here</span></span></p>
                        </div>
                        <div class="file-name">
                            <p id="js-file-name">{filename ? filename : 'No file selected'}</p>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="position-absolute top-80 start-50 translate-middle">
                    <input disabled={!file} type="submit" value="Upload" className="btn btn-primary btn-block" />
                    <Progress percents={uploadPercentage}/>
                    {loading ? <div>Loading ...</div> : <div></div>}
                </div>
        

                {uploadedFile.isPassed ? 
                    <div className="position-absolute top-80 start-50 translate-middle be-first">
                        <Modal modalText={"Are you want to proceed for processing?"} modalTitle={"Upload Passed Successfully"} 
                        onSave={(e) => {
                            navigate("/processVideo")
                            setCurrentRoute(2)
                        }}
                        onClose={(e) => {
                            setUploadedFile({ ...uploadedFile, isPassed: false})
                        }}/>
                    </div>
                    
                : 
                <div>{errorUploadingFile && errorUploadingFile.msg}</div>}
            </form>

       

        </Fragment>
    )
}

export default FileUpload