import * as React from "react"
import ConnectedFileUpload from '../components/ContainerFileUpload'
import "./styles.css"
import Layout from "../components/Layout";
import { Helmet } from "react-helmet"


const UploadVideo = ({count}) => {
    return (
        <Layout>
              <Helmet
                bodyAttributes={{
                    class: 'overflow-body'
                }}
            />
            <h4 className="display-4 text-center mb-4">
                <i className="fab fa-react">Upload For Processing</i>
            </h4>
            <div className="position-absolute top-50 start-50 translate-middle">
                <ConnectedFileUpload />
            </div>
        </Layout>
    )
}

export default UploadVideo