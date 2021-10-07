import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import { checkAuth, setAuth, getUserId } from '../../verifyLogin';
import './UserInfo.scss'

const UserInfo = () => {

    const [nameState, setNameState] = useState("")
    const [numberState, setNumberState] = useState("")
    const [emailState, setEmailState] = useState("")
    const [errorsState, setErrorsState] = useState({});

    useEffect(() => {
        fetch(`${process.env.API_URL}/api/profile?token=${localStorage.getItem('token')}&username=${getUserId()}`,
        {
          method: 'GET',
        }
        )
        .then((response) => response.json())
        .then((result) => {
          console.log('Success: ', result);
          setNameState(result.name)
          setNumberState(result.phonenumber)
          setEmailState(result.email)
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
      }, [])
  
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
          if (numberState.length != 12) {
              console.log(numberState.length)
              errors.number = "Invalid phonenumber."
          }
          if (isNaN(numberState)) errors.number = "Invalid phonenumber."
          if (numberState.length == '') errors.email = "Email can not be blank"
          if (emailState == '') errors.email = "Email can not be blank."
          if (emailState.length > 45) errors.email = "Email is too long."
    
          if (Object.keys(errors) !== 0){
            setErrorsState(errors)
            return errors;
          }
        }
    
        const errors = validate()
    
        if (Object.keys(errors).length === 0){
          const formData = new FormData();
          formData.append('name', nameState)
          formData.append('phonenumber', numberState)
          formData.append('email', emailState)

          fetch(
            `${process.env.API_URL}/api/profile?token=${localStorage.getItem('token')}&username=${getUserId()}`,
            {
              method: "POST",
              mode: "no-cors",
              body: formData,
            }
          )
            .then((response) => response.json)
            .then((result) => {
              console.log("Success: ", result);
              alert("Thank you! Submission Complete!")
              window.location.assign("/reserve")
    
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
          
        }
        else {
          alertObject(errors)
        }
    
      };
  

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