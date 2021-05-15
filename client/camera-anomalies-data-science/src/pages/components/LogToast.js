import React, {Fragment, useState, useEffect  } from "react"
import * as style from "./css/LogToast.module.css"

const LogToast = ({id, detectionTime, description, detectionType, accuracy, toastShowFade}) => {
    return (
        <Fragment>
           <div style={{height: "200px", 'margin-bottom': "10px"}} className={`${toastShowFade}`} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="toast-header">
                    <svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#f09126"></rect></svg>
                    <strong className="me-auto">Detection Found</strong>
                    <strong className="me-auto">Id: {id}</strong>
                    <small className="text-muted">Video Time: {detectionTime}</small>
                    <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div style={{height: "100px"}} className="toast-body">
                    <div> Detection Time: {detectionTime}</div>
                    <div> Detection Type: {detectionType}</div>
                    <div> Description: {description}</div>
                    <div> Accuracy: {accuracy}</div>
                    <div>Did it happen?</div>
                    <div class="form-check form-check-inline">
                        <input onClick={() => {}} class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1"/>
                        <label class="form-check-label" for="inlineCheckbox1">Fatal</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2"/>
                        <label class="form-check-label" for="inlineCheckbox2">High Risk</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="inlineCheckbox3" value="option3"/>
                        <label class="form-check-label" for="inlineCheckbox3">Potiental Risk</label>
                    </div>
                </div>
                
            </div>
        </Fragment>
    )
}


export default LogToast