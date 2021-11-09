import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import './GuestInfo.scss'

const GuestInfo = () => {

    const [nameState, setNameState] = useState("")
    const [numberState, setNumberState] = useState("")
    const [emailState, setEmailState] = useState("")
    const [errorsState, setErrorsState] = useState({});
  
    const SaveInfo = () => {
        function alertObject(obj){      
            for(var key in obj) {
            alert(obj[key]);
            if( typeof obj[key] === 'object' ) {
                alertObject(obj[key]);
            }
            }
        }
      
          const validate = () =>{
            let errors = {};
            if (nameState == '') errors.name = "Name can not be blank."
            if (nameState.length > 45) errors.name = "Name is too long."
            if (numberState.length != 10) {
                errors.number = "Invalid phonenumber."
            }
            if (isNaN(numberState)) errors.number = "Invalid phonenumber."
            if (numberState.length == '') errors.email = "Email can not be blank"
            if (emailState == '') errors.email = "Email can not be blank."
            if (emailState.length > 45) errors.email = "Email is too long."
      
            if (Object.keys(errors) !== 0){
              setErrorsState(errors)
              return errors
            }
          }
          const errors = validate()
    
          if (Object.keys(errors).length === 0){
            window.location.assign(`/reserve?guest=true&name=${nameState}&number=${numberState}&email=${emailState}`)
          }
          else {
              alertObject(errors)
          }


    }
  

    return(
      <div>
      <div className="GuestInfo">
          <div className="GuestInfo__container">
          <div className="title">
          <h1>Guest Information</h1>
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
                      value="Continue"
                      onClick={SaveInfo}
                  />
              </div>
          </div>

      </div>
      </div>
  );
}

export default GuestInfo;