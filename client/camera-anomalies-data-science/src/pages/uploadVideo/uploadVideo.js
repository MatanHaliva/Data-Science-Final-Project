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
            <h4 className="display-4 text-center mb-4">
                <i className="fab fa-react">Upload For Processing</i>
            </h4>
     
            <ConnectedFileUpload />
           


            {/* <div class="file-container">
                <div class="file-overlay"></div>
                <div class="file-wrapper">
                    <input class="file-input" id="js-file-input" type="file"/>
                    <div class="file-content">
                    <div class="file-infos">
                        <p class="file-icon"><FaFileUpload size={100}/><span class="icon-shadow"></span><span>Click to browse<span class="has-drag">or drop file here</span></span></p>
                    </div>
                    <p class="file-name" id="js-file-name">No file selected</p>
                    </div>
                </div>
            </div> */}
        </Layout>
    )
}

export default UploadVideo