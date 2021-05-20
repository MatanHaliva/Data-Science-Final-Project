import React, {Fragment, useEffect, useState} from "react"
import { navigate } from "gatsby-link";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Logout = () => {
    const navigateToLoginPage = () => {
        sleep(1000).then(() => {
            localStorage.removeItem("loginInfo")
            navigate('/login')
        })

        return (
        <Fragment>
            <div class="position-absolute top-50 start-50 translate-middle">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </Fragment>
        )
    }

    return navigateToLoginPage()
    
}

export default Logout