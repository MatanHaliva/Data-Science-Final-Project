import React, {Fragment, useEffect, useReducer, useState} from "react"
import { FaUser, FaKey, FaFacebookSquare, FaGooglePlusSquare, FaTwitterSquare } from 'react-icons/fa';
import axios from "axios"
import { navigate } from "gatsby-link";
import { setCurrentRoute, setLogin } from "../../redux/actions";
import { useDispatch, useSelector } from 'react-redux'
import { isLogged } from '../../shared/isLogged'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const isLoggedValue = useSelector(state => isLogged(state, dispatch, setLogin))


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target.email.value)      
        console.log(event.target.password.value) 

        const loginUrl = "http://localhost:5000/login"

        try {
            setLoading(true)
            const res = await axios.post(loginUrl, {email: event.target.email.value, password: event.target.password.value})
            await dispatch(setLogin({ isLogged: true, token: res.data.token, firstname: res.data.firstname, lastname: res.data.lastname }))
            setLoading(false)
            navigate("/")
            dispatch(setCurrentRoute(0))
        } catch (err) {
            console.log(err)
            setError(err.response.data.status)
            setLoading(false)
        }
    }

    useEffect(() => {
        // if (isLoggedValue) {
        //     navigate("/dashboard")
        // }
    }, [])

    return (
    <div className="container">
        <div className="position-absolute top-50 start-50 translate-middle">
            <div className="login-card">
                <div className="card-header">
                    <h3>Sign In</h3>
                    <div className="d-flex justify-content-end social_icon">
                        <span><FaFacebookSquare/></span>
                        <span><FaGooglePlusSquare/></span>
                        <span><FaTwitterSquare/></span>
                    </div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}> 
                        <div className="input-group form-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><FaUser/></span>
                            </div>
                            <input name="email" type="text" className="form-control" placeholder="Email" />
                        </div>
                        <div className="input-group form-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text"><FaKey/></span>
                            </div>
                            <input name="password" type="password" className="form-control" placeholder="Password"/>
                        </div>
                        <div className="row align-items-center remember">
                            <input type="checkbox"/>Remember Me
                        </div>
                        {loading ? <div className="loading-spinner">
                            <div class="spinner-border text-warning" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div> : <div/>}
                        <div className="form-group login-button">
                            <input type="submit" value="Login" className="btn float-right login_btn"/>
                        </div>
                    </form>
                    {error ? <div className="form-group login-button" style={{color: "red"}}> Errors: {error} </div> : <div/>}
                </div>
                <div className="card-footer">
                    <div className="d-flex justify-content-center links">
                        Don't have an account?<a href="#">Sign Up</a>
                    </div>
                    <div className="d-flex justify-content-center">
                        <a href="#">Forgot your password?</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login