import React, { useEffect, useState } from "react";
import './Register.scss'
import { Redirect, Link } from 'react-router-dom';

const Register = () => {

    const [usernameState, setUsernameState] = useState("")
    const [passwordState, setPasswordState] = useState("")
    const [confirmPasswordState, setConfirmPasswordState] = useState("")

    const handleSubmit = () => {
        return 

        };

    return(
        <div>
        <div className="register">
            <div className="register__container">
            <div className="title">
            <h1>Register</h1>
            </div>
                <div className="formbox">
                    <div className= "in">
                        <label>Username:</label>
                        <input className="usernameInput"
                            type="text"
                            name="username"
                            id="username"
                            value={usernameState}
                            onChange={(e)=>setUsernameState(e.target.value)}
                        />
                    </div>
                    <div className= "in">
                        <label>Password:</label>
                            <input className="add"
                                type="password"
                                name="pass"
                                id="pass"
                                value = {passwordState}
                                onChange={(e)=>setPasswordState(e.target.value)}
                            />
                    </div>
                        <div className ="in">
                            <label>Confirm Password:</label>
                                <input className="add"
                                    type="password"
                                    name="pass"
                                    id="pass"
                                    value = {confirmPasswordState}
                                    onChange={(e)=>setConfirmPasswordState(e.target.value)}
                                />
                        </div>
                </div>
                <div className="button">
                    <input 
                        className="registerButton"
                        type= "button" 
                        value="Register"
                        onClick={handleSubmit}
                    />
                </div>
            </div>

        </div>
            <div className="loginLink">
                    <label>Already have an account? Click{'\u00A0'}</label>
                        <Link to="/login">here</Link>
            </div>
        </div>
    );
}

export default Register;