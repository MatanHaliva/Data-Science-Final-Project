import React from "react"
import { Fragment } from "react";
import { FaVideo } from 'react-icons/fa';

const CardChild = ({loading, children, cardHeader, cardDescription, width, height, picked}) => {
    const className = picked ? "card card-picked" : "card"  

    const loadingPage = () => {
        console.log("picked loading page..")
        return (
            <Fragment>
                <div style={{width: width, height: height}} >
                        <div class="timeline-item" style={{width: width, height: height}}>
                            <div class="animated-background">
                                <div class="background-masker header-top"></div>
                                <div class="background-masker header-left"></div>
                                <div class="background-masker header-right"></div>
                                <div class="background-masker header-bottom"></div>
                                <div class="background-masker subheader-left"></div>
                                <div class="background-masker subheader-right"></div>
                                <div class="background-masker subheader-bottom"></div>
                                <div class="background-masker content-top"></div>
                                <div class="background-masker content-first-end"></div>
                                <div class="background-masker content-second-line"></div>
                                <div class="background-masker content-second-end"></div>
                                <div class="background-masker content-third-line"></div>
                                <div class="background-masker content-third-end"></div>
                            </div>
                        </div>
                  
                </div>
            </Fragment>
        )
    }

    const notLoadingPage = () => {
        console.log("picked not loading page..")

        return (
            <div className={className} style={{width: width, height: height}}>
                <div class="card-body">
                    <h1 class="card-title">{cardHeader} <FaVideo/></h1> 
                    <p class="card-text">{cardDescription}</p>
                </div>
                <div class="position-absolute top-50 start-50 translate-middle">
                    {children}
                </div>
            </div>
        )
    }
    console.log("loading", loading)
   
    return loading ? loadingPage() : notLoadingPage()

}

export default CardChild


