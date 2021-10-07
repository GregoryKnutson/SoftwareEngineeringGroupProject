import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import './UserInfo.scss'

const UserInfo = () => {

    const [nameState, setNameState] = useState("")
    const [numberState, setNumberState] = useState("")
    const [emailState, setEmailState] = useState("")
  
    const SaveInfo = () => {
      return
    }
  

    return(
      <div>
      <div className="UserInfo">
          <div className="UserInfo__container">
          <div className="title">
          <h1>User Information</h1>
          </div>
              <div className="formbox">
              <div className= "in">
                  <label>Name:</label>
                  <input className="nameInput"
                      type="text"
                      name="name"
                      id="name"
                      value={nameState}
                      onChange={(e)=>setNameState(e.target.value)}
                  />
              </div>
              <div className= "in">
                  <label>Phone Number:</label>
                  <input className="numberInput"
                      type="text"
                      name="number"
                      id="number"
                      value={numberState}
                      onChange={(e)=>setNumberState(e.target.value)}
                  />
              </div>
              <div className= "in">
                  <label>Email:</label>
                  <input className="emailInput"
                      type="text"
                      name="email"
                      id="email"
                      value={emailState}
                      onChange={(e)=>setEmailState(e.target.value)}
                  />
              </div>
              </div>
              <div className="button">
                  <input 
                      className="reserveButton"
                      type= "button" 
                      value="Update"
                      onClick={SaveInfo}
                  />
              </div>
          </div>

      </div>
      </div>
  );
}

export default UserInfo;