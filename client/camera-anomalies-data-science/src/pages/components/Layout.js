import React, {Fragment, useState} from "react"
import { Link } from "gatsby"
import ContainerNavBar from "./ContainerNavBar"
import Footer from "./Footer"
import SideBar from "./SideBar"
import * as style from "./css/Layout.module.css"

const Layout = ({children}) => {
    return (
        <Fragment>
            <ContainerNavBar/>
            <div className={`layout ${style.main}`}>
                <SideBar/>
                <div>
                    {children}
                </div>
                <Footer/>
            </div>
        </Fragment>
    )
}

export default Layout