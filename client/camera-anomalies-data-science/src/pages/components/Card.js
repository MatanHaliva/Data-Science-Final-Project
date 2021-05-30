import React from "react"
import { FaVideo } from 'react-icons/fa';

const Card = ({rows, cardHeader, cardDescription}) => {
    return (
        <div class="card" style={{width: "18rem;"}}>
            <div class="card-body">
                <h1 class="card-title">{cardHeader} <FaVideo/></h1> 
                <p class="card-text">{cardDescription}</p>
            </div>
            <ul class="list-group list-group-flush">
            {
                rows.map(row => {
                    return (
                    <li class="list-group-item"> 
                        <span><h4>{row.header}:</h4> <h7>{row.content}</h7></span>
                     </li>)
                })
            }
            </ul>
            <div class="card-body">
                {/* <a href="#" class="card-link">Card link</a>
                <a href="#" class="card-link">Another link</a> */}
            </div>
        </div>
    )  
}

export default Card