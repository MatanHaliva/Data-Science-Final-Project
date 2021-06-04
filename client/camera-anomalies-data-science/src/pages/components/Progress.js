import React from "react"


const Progress = ({ percents, className}) => {
    return (<div className={`progress ${className}`}>
                <div className="progress-bar progress-bar-striped" role="progressbar" style={{width: `${percents}%`}}> {percents}% </div>
            </div>)
}

export default Progress