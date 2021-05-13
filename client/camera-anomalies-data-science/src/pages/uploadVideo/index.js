import * as React from "react"
import FileUpload from '../components/FileUpload'
import "./styles.css"

const UploadVideo = () => {
    return (
    <div className="container">
        <h4 className="display-4 text-center mb-4">
            <i className="fab fa-react">Upload For Processing</i>
        </h4>

        <FileUpload />
    </div>)
}

export default UploadVideo