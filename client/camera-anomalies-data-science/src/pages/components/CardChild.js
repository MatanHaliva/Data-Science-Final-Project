import React from "react"
import { Fragment } from "react";
import { FaVideo } from 'react-icons/fa';
import {useSelector} from "react-redux"

const CardChild = ({loading, children, cardHeader, cardDescription, width, height, picked, index, onCardClicked}) => {
    const className = picked ? "card card-picked" : "card"  
    const contextId = useSelector(state => state.app.contextId)

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
        return (
            <div className={`selection-wrapper`} style={{width: width, height: height}}>
            <label htmlFor={`selected-item-${index}`} class="selected-label">
                <input checked={contextId === index ? true : false} onClick={() => {
                    if (typeof v === 'function') {
                        onCardClicked(index)
                    }
                }} type="radio" name="selected-item" id={`selected-item-${index}`}/>
                <span class="icon"></span>
                <div class="selected-content" style={{width: width, height: height}}>
                    {children}
                </div>
            </label>
        </div>
        )
    }
   
    return loading ? loadingPage() : notLoadingPage()

}

export default CardChild


