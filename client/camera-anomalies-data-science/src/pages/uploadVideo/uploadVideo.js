import * as React from "react"
import ConnectedFileUpload from '../components/ContainerFileUpload'
import "./styles.css"
import Layout from "../components/Layout";


const UploadVideo = ({count}) => {
    return (
        <Layout>
            <div className="container position-absolute top-50 start-50 translate-middle">
                <h4 className="display-4 text-center mb-4">
                    <i className="fab fa-react">Upload For Processing</i>
                </h4>

                <ConnectedFileUpload />
            </div>
        </Layout>
    )
}

export default UploadVideo