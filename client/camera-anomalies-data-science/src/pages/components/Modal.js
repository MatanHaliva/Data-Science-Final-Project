import React, {Fragment, useState} from "react"

const Modal = ({modalTitle, modalText, onClose, onSave}) => {
    
    return (
        <div style={{display: 'block'}} className="modal" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{modalTitle}</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => onClose(e)}>
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>{modalText}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={(e) => onSave(e)}>Save changes</button>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => onClose(e)}>Close</button>
                </div>
                </div>
            </div>  
        </div>
    )
}

export default Modal