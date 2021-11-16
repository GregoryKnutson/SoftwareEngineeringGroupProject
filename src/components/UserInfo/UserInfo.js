import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { checkAuth, setAuth, getUserId } from "../../verifyLogin";
import Address from "./AddressForm";
import "./UserInfo.scss";
import NavBar from "../NavBar/NavBar";

const UserInfo = () => {

  let emptyAddress = {
    address: "",
    city: "",
    state: "",
    zip: ""
}

  const [nameState, setNameState] = useState("");
  const [numberState, setNumberState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [checked, setChecked] = useState(true);
  const [errorsState, setErrorsState] = useState({});

  const [billingAddress, setBillingAddress] = useState(emptyAddress)
  const [mailingAddress, setMailingAddress] = useState(emptyAddress)

  const changeBillingAddress = (e) => {
    setBillingAddress({...billingAddress, [e.target.name]:e.target.value})

    if(checked){
      setMailingAddress({...billingAddress, [e.target.name]:e.target.value})
    }
  }

  const changeMailingAddress = (e) => {
    setMailingAddress({...mailingAddress, [e.target.name]:e.target.value})
  }

  const haveSameData = function (obj1, obj2) {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
        return Object.keys(obj1).every(
            key => obj2.hasOwnProperty(key)
                && obj2[key] === obj1[key]);
    }
    return false;
}

  useEffect(() => {
    fetch(
      `${process.env.API_URL}/api/profile?token=${localStorage.getItem("token")}&username=${getUserId()}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {


        console.log("Success: ", result);
        setNameState(result.name);
        setNumberState(result.phonenumber);
        setEmailState(result.email);
        setBillingAddress(result.billingAddress)
        setMailingAddress(result.mailingAddress)

        if(!haveSameData(result.billingAddress, result.mailingAddress)){
          setChecked(false)
          setMailingAddress(result.mailingAddress)
        }

      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const SaveInfo = (e) => {
    e.preventDefault()
    function alertObject(obj) {
      for (var key in obj) {
        alert(obj[key]);
        if (typeof obj[key] === "object") {
          alertObject(obj[key]);
        }
      }
    }
    console.log(mailingAddress)
    console.log(billingAddress)

    const validate = () => {
      let errors = {};

      if (nameState == "") errors.name = "Name can not be blank.";
      if (nameState.length > 45) errors.name = "Name is too long.";
      if (numberState.length != 10) errors.number = "Invalid phonenumber.";
      if (isNaN(numberState)) errors.number = "Invalid phonenumber.";
      if (numberState.length == "") errors.email = "Email can not be blank";
      if (emailState == "") errors.email = "Email can not be blank.";
      if (emailState.length > 45) errors.email = "Email is too long.";

      if (billingAddress.address.length > 50) errors.billingAddress = "Billing address is too long."
      if (billingAddress.address.length == '') errors.billingAddress = "Billing address can not be blank."
      if (mailingAddress.address.length > 50) errors.mailingAddress = "Mailing address is too long."
      if (mailingAddress.address.length == '') errors.mailingAddress = "Mailing address can not be blank."
      if (billingAddress.city.length > 20) errors.city = "Billing address city is too long."
      if (billingAddress.city.length == '') errors.city = "Billing address city can not be blank."
      if (mailingAddress.city.length > 20) errors.city = "Mailing address city is too long."
      if (mailingAddress.city.length == '') errors.city = "Mailing address city can not be blank."
      if (billingAddress.state.length != 2) errors.state = "Please select a state."
      if (mailingAddress.state.length != 2) errors.city = "Please select a state."
      if (billingAddress.zip.length < 5 || billingAddress.zip.length > 9) errors.zip = "Please Enter Valid Zip Code for Billing Address."
      if (mailingAddress.zip.length < 5 || mailingAddress.zip.length > 9) errors.zip = "Please Enter Valid Zip Code for Mailing Address."
      

      if (Object.keys(errors) !== 0) {
        setErrorsState(errors);
        return errors;
      }
    };

    const errors = validate();

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("name", nameState);
      formData.append("phonenumber", numberState);
      formData.append("email", emailState);
      formData.append("billingAddress", JSON.stringify(billingAddress))
      formData.append("mailingAddress", JSON.stringify(mailingAddress))

      fetch(
        `${process.env.API_URL}/api/profile?token=${localStorage.getItem(
          "token"
        )}&username=${getUserId()}`,
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      )
        .then((response) => response.json)
        .then((result) => {
          console.log("Success: ", result);
          alert("Thank you! Submission Complete!");
          window.location.assign("/reserve");
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    } else {
      alertObject(errors);
    }
  };

  const showMailingAddress = () => {
    if (!checked) {
      return (
        <div>
          <div className="billingTitle">
            <label className="billingLabel">Mailing Address:</label>
          </div>
          <Address address={mailingAddress} onAddressChange={changeMailingAddress}/>
        </div>
      );
    }
  };

  const handleCheck = (e) => {
    setChecked(e.target.checked)

    if(checked === true){
      setMailingAddress(emptyAddress)
    }
    else{
      setMailingAddress(billingAddress)
    }
  }

  return (
    <div>
      <NavBar/>
      <div className="UserInfo">
        <div className="UserInfo__container">
          <div className="title">
            <h1>User Information</h1>
          </div>
          <form onSubmit = {SaveInfo}>
          <div className="formbox">
            <div className="in">
              <label>Name:</label>
              <input
                className="nameInput"
                type="text"
                name="name"
                id="name"
                value={nameState}
                onChange={(e) => setNameState(e.target.value)}
              />
            </div>
            <div className="in">
              <label>Phone Number:</label>
              <input
                className="numberInput"
                type="text"
                name="number"
                id="number"
                value={numberState}
                onChange={(e) => setNumberState(e.target.value)}
              />
            </div>
            <div className="in">
              <label>Email:</label>
              <input
                className="emailInput"
                type="text"
                name="email"
                id="email"
                value={emailState}
                onChange={(e) => setEmailState(e.target.value)}
              />
            </div>
            <div className="billingaddress">
              <div className="billingTitle">
                <label className="billingLabel">Billing Address:</label>
              </div>
              <Address address={billingAddress} onAddressChange={changeBillingAddress}/>
            </div>
            <div className="deliveryAddress">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleCheck(e)}
                  value={checked}
                />
                <label className="checkboxLabel">
                  My billing address is the same as my delivery address.
                </label>
              </div>
            {showMailingAddress()}
            </div>
          </div>
          <div className="button">
            <input
              className="reserveButton"
              type="submit"
              value="Update"
            />
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
