import * as React from "react"
import ConnectedFileUpload from '../components/ContainerFileUpload'
import "./styles.css"
import Layout from "../components/Layout";
import { Helmet } from "react-helmet"
import { FaFileUpload } from 'react-icons/fa';


const UploadVideo = ({count}) => {
    return (
        <Layout>
              <Helmet
                bodyAttributes={{
                    class: 'overflow-body'
                }}
            />
            <h4 className="display-4 text-center mb-4 header-upload-for-processing">
                <i className="fab fa-react">Upload For Processing</i>
            </h4>
            <ConnectedFileUpload />
        </Layout>
    )
}

export default UploadVideo