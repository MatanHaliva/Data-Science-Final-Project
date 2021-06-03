import React, {Fragment, useEffect, useState} from "react"
import Layout from "../components/Layout"

const TestCard = () => {

    return (
        <Layout>
            <div class="selection-wrapper">
                <label for="selected-item-2" class="selected-label">
                    <input type="radio" checked name="selected-item" id="selected-item-2"/>
                    <span class="icon"></span>
                    <div class="selected-content">
                        <img src="https://image.freepik.com/free-vector/people-putting-puzzle-pieces-together_52683-28610.jpg" alt=""/>
                        <h4>Lorem ipsum dolor.</h4>
                        <h5>Lorem ipsum dolor sit amet, consectetur.</h5>
                    </div>
                </label>
            </div>
        </Layout>
    )
}


export default TestCard