import React, { useEffect, useState, setError } from "react";
import { Redirect, Link } from 'react-router-dom';
import { checkAuth, setAuth, destroyAuth } from '../../verifyLogin';
import './Login.scss'
import NavBarGuest from '../NavBar/NavBarGuest'

const Login = () => {

  destroyAuth()

  if (checkAuth()) {
    return (
      <Redirect to='/reserve' />
    )
  }

  const [usernameState, setUsernameState] = useState("")
  const [passwordState, setPasswordState] = useState("")
  const [error, setError] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("username", usernameState)
    formData.append("password", passwordState)

    fetch(`${process.env.API_URL}/api/login`, {
        method: 'POST',
        body: formData,
      })
        .then(res => {
          if(!res.ok) {
            alert("Invalid username/password!");
            throw Error('Could not fetch the data for that resource');
          }
          if (res.status != 200) {
            alert("Invalid username/password!");
          }
          return res.json();
        })
        .then(res => {
          setAuth(res)
          console.log("test")
          window.location.assign("/reserve")
        })
        .catch(error => {
          console.log(error);
          setError(true);
        })

        if (checkAuth()) {
          return (
            <Redirect to='/reserve' />
          )
        }
  }


    return(
      <div>
        <NavBarGuest/>
      <div className="login">
          <div className="login__container">
          <div className="title">
          <h1>Login</h1>
          </div>
          <form onSubmit={handleLogin}>
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
                      type= "submit" 
                      value="Login"
                  />
              </div>
            </form>
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