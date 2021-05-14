import React, {Fragment, useState, useEffect  } from "react"

const LogToast = ({detectionTime, description, detectionType, accuracy}) => {
    return (
        <Fragment>
           <div style={{height: "200px", 'margin-bottom': "10px"}} className="toast show fade" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#f09126"></rect></svg>
                    <strong className="me-auto">Detection Found</strong>
                    <small className="text-muted">{detectionTime}</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div style={{height: "100px"}} className="toast-body">
                    <div> Detection Time: {detectionTime}</div>
                    <div> Detection Type: {detectionType}</div>
                    <div> Description: {description}</div>
                    <div> Accuracy: {accuracy}</div>
                </div>
            </div>
        </Fragment>
    )
}


export default LogToast