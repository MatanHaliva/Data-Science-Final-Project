import * as React from "react"
import ConnectedFileUpload from '../components/ContainerFileUpload'
import "./styles.css"

const UploadVideo = ({count}) => {
    console.log(count)
    return (
    <div className="container">
        <h4 className="display-4 text-center mb-4">
            <i className="fab fa-react">Upload For Processing</i>
        </h4>

        <ConnectedFileUpload />

    </div>)
}

export default UploadVideo