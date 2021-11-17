import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-bootstrap-time-picker'
import './ReserveTable.scss'
import { checkAuth, getUserId } from "../../verifyLogin";
import NavBar from "../NavBar/NavBar";
import NavBarGuest from "../NavBar/NavBarGuest"
import ConfirmModal from "./confirmModal"

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

    return(
      <div id="bootstrap-overides">
      <div className="reserveTable">
          {isLoggedIn
          ? <NavBar></NavBar>
          : <NavBarGuest></NavBarGuest>
          }
          <div className="reserveTable__container">
          <div className="title">
          <h1>Reserve Table</h1>
          </div>
          <form>
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
                          <TimePicker className="TableTimePicker"
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
              <ConfirmModal
                name={nameState}
                number={numberState}
                email={emailState}
                date={dateState}
                startTime={startTimeState}
                endTime={endTimeState}
                numGuests={numGuestsState}
                isLoggedIn={isLoggedIn}
              />
              </form>
          </div>

      </div>
      </div>
  );
}

export default ReserveTable;