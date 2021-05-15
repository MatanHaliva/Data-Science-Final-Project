import React from "react"


const Progress = ({ percents }) => {
    return (<div className="progress">
                <div className="progress-bar progress-bar-striped" role="progressbar" style={{width: `${percents}%`}}> {percents}% </div>
            </div>)
}

export default Progress