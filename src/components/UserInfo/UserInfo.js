import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { checkAuth, setAuth, getUserId } from "../../verifyLogin";
import Address from "./AddressForm";
import "./UserInfo.scss";

const UserInfo = () => {

  let tempAddress = {
    address: "",
    city: " ",
    state: " ",
    zip: " "
}

  const [nameState, setNameState] = useState("");
  const [numberState, setNumberState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [checked, setChecked] = useState(true);
  const [errorsState, setErrorsState] = useState({});

  const [billingAddress, setBillingAddress] = useState(tempAddress)
  const [mailingAddress, setMailingAddress] = useState(tempAddress)

  const changeBillingAddress = (e) => {
    setBillingAddress({...billingAddress, [e.target.name]:e.target.value})

    if(checked){
      setMailingAddress({...billingAddress, [e.target.name]:e.target.value})
    }
  }

  const changeMailingAddress = (e) => {
    setMailingAddress({...mailingAddress, [e.target.name]:e.target.value})
  }

  useEffect(() => {
    fetch(
      `${process.env.API_URL}/api/profile?token=${localStorage.getItem(
        "token"
      )}&username=${getUserId()}`,
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
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const SaveInfo = () => {
    function alertObject(obj) {
      for (var key in obj) {
        alert(obj[key]);
        if (typeof obj[key] === "object") {
          alertObject(obj[key]);
        }
      }
    }

    const validate = () => {
      let errors = {};

      if (nameState == "") errors.name = "Name can not be blank.";
      if (nameState.length > 45) errors.name = "Name is too long.";
      if (numberState.length != 12) errors.number = "Invalid phonenumber.";
      if (isNaN(numberState)) errors.number = "Invalid phonenumber.";
      if (numberState.length == "") errors.email = "Email can not be blank";
      if (emailState == "") errors.email = "Email can not be blank.";
      if (emailState.length > 45) errors.email = "Email is too long.";

      if (billingAddress.address.length > 20) errors.billingAddress = "Billing address is too long."
      if (billingAddress.address.length == '') errors.billingAddress = "Billing address can not be blank."
      if (mailingAddress.address.length > 20) errors.mailingAddress = "Mailing address is too long."
      if (mailingAddress.address.length == '') errors.mailingAddress = "Mailing address can not be blank."
      if (billingAddress.city.length > 20) errors.city = "Billing address city is too long."
      if (billingAddress.city.length == '') errors.city = "Billing address city can not be blank."
      if (mailingAddress.city.length > 20) errors.city = "Mailing address city is too long."
      if (mailingAddress.city.length == '') errors.city = "Mailing address city can not be blank."
      if (billingAddress.state.length != 2) errors.state = "Please select a state."
      if (mailingAddress.state.length != 2) errors.city = "Please select a state."
      if (billingAddress.zip.length < 5 || billingAddress.zip.length > 9) errors.zip = "Please Enter Valid Zip Code."
      if (mailingAddress.zip.length < 5 || mailingAddress.zip.length > 9) errors.zip = "Please Enter Valid Zip Code."
      

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

  const isMailingAddress = () => {
    if (!checked) {
      return (
        <div>
          <div className="billingTitle">
            <label className="billingLabel">Mailing Address:</label>
          </div>
          <Address Address={mailingAddress} onAddressChange={changeMailingAddress}/>
        </div>
      );
    }
  };

  const Test = () => {
    console.log(billingAddress)
    console.log(mailingAddress)
  }

  const handleCheck = (e) => {
    setChecked(e.target.checked)
    console.log(checked)

    if(checked === true){
      setMailingAddress(tempAddress)
    }
    else{
      setMailingAddress(billingAddress)
    }
  }

  return (
    <div>
      <div className="UserInfo">
        <div className="UserInfo__container">
          <div className="title">
            <h1>User Information</h1>
          </div>
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
              <Address Address={billingAddress} onAddressChange={changeBillingAddress}/>
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
              {isMailingAddress()}
            </div>
          </div>
          <div className="button">
            <input
              className="reserveButton"
              type="button"
              value="Update"
              onClick={SaveInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserInfo;
