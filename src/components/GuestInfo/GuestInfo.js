import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import './GuestInfo.scss'
import NavBarGuest from '../NavBar/NavBarGuest'
import PaymentModal from "../Payment/PaymentModal";
import useForm from "../Payment/useForm"

const GuestInfo = () => {

    const [nameState, setNameState] = useState("")
    const [numberState, setNumberState] = useState("")
    const [emailState, setEmailState] = useState("")
    const [errorsState, setErrorsState] = useState({});
    const { handleChange, handleFocus, values } = useForm();
    const [cardAdded, setCardAdded] = useState(false)
  
    const SaveInfo = (e) => {
        e.preventDefault()
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
            if (cardAdded == false) errors.card = "Please add a valid card"
      
            if (Object.keys(errors) !== 0){
              setErrorsState(errors)
              return errors
            }
          }
          const errors = validate()
    
          if (Object.keys(errors).length === 0){
            const formData = new FormData();
            formData.append("name", nameState);
            formData.append("phonenumber", numberState);
            formData.append("email", emailState);
            formData.append("payment", JSON.stringify(values))
      
            fetch(
              `${process.env.API_URL}/api/guest`,
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((result) => {
                console.log("Success: ", result);
                alert("Thank you! Submission Complete!");
                window.location.assign(`/reserve?guest=true&token=${result.token}`);
              })
              .catch((error) => {
                console.error("Error: ", error);
              });
          } else {
            alertObject(errors);
          }


    }
  

    return(
      <div>
        <NavBarGuest/>
      <div className="GuestInfo">
          <div className="GuestInfo__container">
          <div className="title">
          <h1>Guest Information</h1>
          </div>
          <form onSubmit = {SaveInfo}>
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
              <div>
                <PaymentModal handleChange={handleChange} handleFocus={handleFocus} values={values} cardAdded={cardAdded} setCardAdded={setCardAdded}></PaymentModal>
            </div>
              </div>
              <div className="button">
                  <input 
                      className="reserveButton"
                      type= "submit" 
                      value="Continue"
                  />
              </div>
            </form>
          </div>

      </div>
      </div>
  );
}

export default GuestInfo;