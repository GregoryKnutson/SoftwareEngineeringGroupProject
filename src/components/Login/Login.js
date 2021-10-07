import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import './Login.scss'

const Login = () => {

  const [usernameState, setUsernameState] = useState("")
  const [passwordState, setPasswordState] = useState("")

  const handleLogin = () => {
    return
  }


    return(
      <div>
      <div className="login">
          <div className="login__container">
          <div className="title">
          <h1>Login</h1>
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
                          value={passwordState}
                          onChange={(e)=>setPasswordState(e.target.value)}
                      />
              </div>
              </div>
              <div className="button">
                  <input 
                      className="loginButton"
                      type= "button" 
                      value="Login"
                      onClick={handleLogin}
                  />
              </div>
          </div>
          <div className="registerLink">
                <label>Don't have an Account? Create one{'\u00A0'}</label>
                  <Link to="/register">here</Link>
          </div>
          <div className="GuestLink">
                <label>or continue as guest{'\u00A0'}</label>
                  <Link to="/guest">here</Link>
          </div>

      </div>
      </div>
  );
}

export default Login;