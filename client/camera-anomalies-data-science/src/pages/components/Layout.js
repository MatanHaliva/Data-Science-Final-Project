import React, {Fragment, useState} from "react"
import { Link } from "gatsby"
import ContainerNavBar from "./ContainerNavBar"
import Footer from "./Footer"

const Layout = ({children}) => {
    return (
    <div className="layout">
          <ContainerNavBar/>
          <div className="container-xxl">
            {children}
          </div>
          <Footer/>
    </div>
    )
}

export default Layout