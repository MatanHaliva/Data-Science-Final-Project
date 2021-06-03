import React, {Fragment, useState} from "react"
import { Link, navigate } from "gatsby"
import ContainerNavBar from "./ContainerNavBar"
import SelectedUpload from "./SelectedUpload"
import Footer from "./Footer"
import SideBar from "./SideBar"
import * as style from "./css/Layout.module.css"
import { shallowEqual, useSelector } from 'react-redux'
import { setLogin } from "../../redux/actions";
import { useDispatch } from 'react-redux'
import { isLogged } from '../../shared/isLogged'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Layout = ({children}) => {
    const dispatch = useDispatch()

    const isLoggedValue = useSelector(state => isLogged(state, dispatch, setLogin))


    const navigateToLoginPage = () => {
        sleep(2500).then(() => {
            navigate('/login')
        })

        return (
        <Fragment>
            <div class="position-absolute top-50 start-50 translate-middle">
                <h4>You are not logged in, redirecting to login page...</h4>
            </div>
        </Fragment>
        )
    }

    return (
        isLoggedValue ? 
        <Fragment>
            <div className="container-all">
                <ContainerNavBar/>
                <div className={`layout ${style.main}`}>
                    <div className="scrollAble flex-fill">
                        {children}
                    </div>
                </div>
                <SelectedUpload/>
            </div>
        </Fragment>
           : navigateToLoginPage()
        
    )
}

export default Layout