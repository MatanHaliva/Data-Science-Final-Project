import React, {Fragment, useState} from "react"
import { Link } from "gatsby"
import { navigate } from "gatsby"
import { FaUserAlt, FaSignOutAlt } from 'react-icons/fa';

const NavBar = ({setCurrentRoute, currentRoute, loggedName}) => {

    const logout = () => {
        navigate("/logout")
    }

    return (
        <nav class="navbar navbar-dark bg-dark navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Intellgent Security Cam</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarScroll">
            <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{height: "100px"}}>
              <li class="nav-item">
                <a className={`nav-link ${currentRoute === 0 ? "active" : ""}`} aria-current="page" href="#" onClick={() => {
                    navigate("/")
                    setCurrentRoute(0)
                }}>Home</a>
              </li>
              <li class="nav-item">
                <a id="uploadVideo" className={`nav-link ${currentRoute === 1 ? "active" : ""}`} href="#" onClick={() => {
                    navigate("/uploadVideo")
                    setCurrentRoute(1)
                }}>Upload Video</a>
              </li>
              <li class="nav-item">
                <a id="uploadVideo" className={`nav-link ${currentRoute === 4 ? "active" : ""}`} href="#" onClick={() => {
                    navigate("/myVideos")
                    setCurrentRoute(4)
                }}>My Uploaded Videos</a>
              </li>
              <li class="nav-item">
                <a id="processVideo" className={`nav-link ${currentRoute === 2 ? "active" : ""}`} href="#" onClick={() => {
                    navigate("/processVideo")
                    setCurrentRoute(2)
                }}>Process Video</a>
              </li>
              <li class="nav-item">
                <a className={`nav-link ${currentRoute === 5 ? "active" : ""}`} aria-current="page" href="#" onClick={() => {
                    navigate("/dashboard")
                    setCurrentRoute(5)
                }}>My Processing Videos</a>
              </li>
              <li class="nav-item">
                <a id="analyseVideo" className={`nav-link ${currentRoute === 3 ? "active" : ""}`} href="#" onClick={() => {
                    navigate("/analyseVideo")
                    setCurrentRoute(3)
                }}>Analyse Video</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Configurations
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><hr class="dropdown-divider"/></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Link</a>
              </li>
            </ul>
            <form class="d-flex">
               <span style={{color: "white"}}>{loggedName}</span>
                <FaUserAlt style={{color: 'white', width: '45px', height: '45px'}}></FaUserAlt>
              <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button class="btn btn-outline-success" type="submit">Search</button>
              <a href="#" onClick={() => {
                   logout()
               }}>
                <FaSignOutAlt style={{color: 'white', width: '45px', height: '45px'}}></FaSignOutAlt>
               </a>
            </form>
          </div>
        </div>
      </nav>
    )
}


export default NavBar