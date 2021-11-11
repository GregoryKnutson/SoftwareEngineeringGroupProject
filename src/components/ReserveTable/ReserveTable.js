import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-bootstrap-time-picker'
import './ReserveTable.scss'
import { checkAuth, getUserId } from "../../verifyLogin";
import NavBar from "../NavBar/NavBar";
import NavBarGuest from "../NavBar/NavBarGuest"

const ReserveTable = () => {

  const [nameState, setNameState] = useState("")
  const [numberState, setNumberState] = useState("")
  const [emailState, setEmailState] = useState("")
  const [dateState, setDateState] = useState(null)
  const [startTimeState, setStartTimeState] = useState(36000)
  const [endTimeState, setEndTimeState] = useState(36000)
  const [numGuestsState, setNumGuestsState] = useState(0)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const nothing = () => {}

  useEffect(() => {
    if (checkAuth()){
        fetch(`${process.env.API_URL}/api/reserve?token=${localStorage.getItem('token')}&username=${getUserId()}`,
        {
          method: 'GET',
        }
        )
        .then((response) => response.json())
        .then((result) => {
          console.log('Success: ', result);
          setLoggedIn(true)

          if (result.name == undefined || result.phonenumber == undefined || result.email == undefined){
            alert("Please enter profile credentials")
            window.location.assign("/profile")
        }
          setNameState(result.name)
          setNumberState(result.phonenumber)
          setEmailState(result.email)
        })
        .catch((error) => {
          console.error('Error: ', error);
        });
    }
    else{
            const search = location.search;
            const params = new URLSearchParams(search)
            if (params.get('guest') == 'true'){
                const name = params.get('name')
                const number = params.get('number')
                const email = params.get('email')

                if (name == undefined || number == undefined || email == undefined){
                    alert("Please enter valid credentials")
                    window.location.assign("/guest")
                }

                setNameState(name)
                setNumberState(number)
                setEmailState(email)

            }
        }
  }, [])

  const getTimeString = (seconds) => {
      var date = new Date(0);
      date.setSeconds(seconds)
      var timeString = date.toISOString().substr(11, 8)
      return timeString
  }



  const handleReserve = (e) => {
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
        if (numberState.length != 10) errors.number = "Invalid phonenumber."
        if (isNaN(numberState)) errors.number = "Invalid phonenumber."
        if (numberState.length == '') errors.email = "Email can not be blank"
        if (emailState == '') errors.email = "Email can not be blank."
        if (emailState.length > 45) errors.email = "Email is too long."
        if (numGuestsState <= 0) errors.guest = "Invalid number of guests."
        if (startTimeState >= endTimeState) errors.time = "Starting time can not be greater than or equal to ending time."
        if (dateState == null) errors.date = "Please select a date."
    
        if (Object.keys(errors) !== 0){
          return errors
        }
      }

    const errors = validate();

    if (Object.keys(errors).length === 0){
        let dayOfTheWeek = dateState.toString().substr(0, 3)
        let dayString = dateState.toISOString().substr(0, 10)
        let startTime = getTimeString(startTimeState)
        let endTime = getTimeString(endTimeState)
    
        const formData = new FormData();
        formData.append('isMember', isLoggedIn)
        formData.append('name', nameState)
        formData.append('number', numberState)
        formData.append('email', emailState)
        formData.append('reservationDay', dayString)
        formData.append('reservationStartTime', startTime)
        formData.append('reservationEndTime', endTime)
        formData.append('numGuests', numGuestsState)
        formData.append('dayOfTheWeek', dayOfTheWeek)
        if(isLoggedIn){
            formData.append('username', getUserId())
        }
  
        fetch(
          `${process.env.API_URL}/api/reserve`,
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
            //window.location.assign("/home")
  
          })
          .catch((error) => {
            console.error("Error: ", error);
          });
        
      }
      else {
        alertObject(errors)
      }
  }

    return(
      <div>
      <div className="reserveTable">
          {isLoggedIn
          ? <NavBar></NavBar>
          : <NavBarGuest></NavBarGuest>
          }
          <div className="reserveTable__container">
          <div className="title">
          <h1>ReserveTable</h1>
          </div>
          <form onSubmit = {handleReserve}>
              <div className="formbox">
              <div className= "in">
                  <label>Name:</label>
                  <input className="nameInput"
                      type="text"
                      name="name"
                      id="name"
                      readOnly={!!nameState}
                      value={nameState}
                      onChange={nameState ? nothing : setNameState}
                  />
              </div>
              <div className= "in">
                  <label>Phone Number:</label>
                  <input className="numberInput"
                      type="text"
                      name="number"
                      id="number"
                      readOnly={!!numberState}
                      value={numberState}
                      onChange={numberState ? nothing : setNumberState}
                  />
              </div>
              <div className= "in">
                  <label>Email:</label>
                  <input className="emailInput"
                      type="text"
                      name="email"
                      id="email"
                      readOnly={!!emailState}
                      value={emailState}
                      onChange={emailState ? nothing : setEmailState}
                  />
              </div>
              <div className= "in">
                  <div className = "reservation">
                      <div className = "reservation_day">
                        <label>Reservation Day:</label>
                            <DatePicker
                                name="reservationDate"
                                id="reservationDate"
                                onChange={setDateState}
                                selected={dateState}
                                minDate={new Date()}
                            />
                      </div>
                      <div className = "reservation_start">
                          <label>Reservation Starting Time:</label>
                          <TimePicker
                          start="10:00"
                          end="22:00"
                          onChange={setStartTimeState}
                          value={startTimeState}
                          />
                      </div>
                      <div className = "reservation_end">
                          <label>Reservation Ending Time:</label>
                          <TimePicker
                          start="10:00"
                          end="22:00"
                          onChange = {setEndTimeState}
                          value={endTimeState}
                          />
                      </div>
                  </div>
              </div>
              <div className= "in">
              <label>Number of Guests:</label>
                  <input className="numGuestsInput"
                      type="number"
                      name="numGuests"
                      id="numGuests"
                      value={numGuestsState}
                      onChange={(e)=>setNumGuestsState(e.target.value)}
                  />
              </div>
              </div>
              <div className="button">
                  <input 
                      className="reserveButton"
                      type= "submit" 
                      value="Reserve"
                  />
              </div>
              </form>
          </div>

      </div>
      </div>
  );
}

export default ReserveTable;