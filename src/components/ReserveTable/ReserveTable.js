import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-bootstrap-time-picker'
import './ReserveTable.scss'
import { checkAuth, getUserId } from "../../verifyLogin";
import * as ReactBootstrap from "react-bootstrap";
import NavBar from "../NavBar/NavBar";
import NavBarGuest from "../NavBar/NavBarGuest"
import ConfirmModal from "./confirmModal"
import jwt_decode from "jwt-decode";

const ReserveTable = () => {

  const [nameState, setNameState] = useState("")
  const [numberState, setNumberState] = useState("")
  const [emailState, setEmailState] = useState({"2": 0, "4": 0, "6": 0, "8": 0})
  const [dateState, setDateState] = useState(null)
  const [availState, setAvailState] = useState(null)
  const [startTimeState, setStartTimeState] = useState(36000)
  const [endTimeState, setEndTimeState] = useState(36000)
  const [numGuestsState, setNumGuestsState] = useState(0)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const [cardState, setCardState] = useState("")
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
                const token = params.get('token')
                let decodedToken = jwt_decode(token);
                setNameState(decodedToken['name'])
                setNumberState(decodedToken['phonenumber'])
                setEmailState(decodedToken['email'])
                setCardState(decodedToken['payment'])
                console.log(cardState)
            }
        }
  }, [])
  const handleGuestsChange = (e) => {
    setNumGuestsState(e.target.value)
    setAvailState(null)
  }
  const getTimeString = (seconds) => {
    var date = new Date(0);
    date.setSeconds(seconds)
    var timeString = date.toISOString().substr(11, 8)
    return timeString
}
  const checkAvail = (e) => {
        e.preventDefault()
        console.log(dateState)
            let dayString = dateState.toISOString().substr(0, 10)
            console.log(dayString)
            let startTime = getTimeString(startTimeState)
            let endTime = getTimeString(endTimeState)
            const sen_ = new FormData();
            sen_.append('numGuests', numGuestsState)
            sen_.append('sTime', startTime)
            sen_.append('eTime', endTime)
            sen_.append('date', dayString)
            fetch(`${process.env.API_URL}/api/avail`,
            {
                method: 'POST',
                body: sen_
            }
            )
            .then((response) => {
                console.log(response)
                return response.json()
            })
            .then((res) => {
                setAvailState(res)
                console.log('Received: ', res)
            })
  }
  const printAvail = (avail, ind) =>{
      console.log(ind)
        return(
            <tr key={ind}>
                <td>{avail[0]}</td>
                <td>{avail[1]} <span style={{fontStyle: "italic"}}> ({parseInt(avail[0])*avail[1]} total occupants)</span></td>
            </tr>
        )
  }
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
                      onChange={handleGuestsChange}
                  />
              </div>
              </div>
              { 
              (numGuestsState > 0 && startTimeState < endTimeState && dateState !== null) &&
                <div className="button">
                    <input
                        className="reserveButton"
                        type="button"
                        value="Check Availability"
                        onClick={checkAvail}
                    />
                </div>
              }
              <ConfirmModal
                name={nameState}
                number={numberState}
                email={emailState}
                date={dateState}
                startTime={startTimeState}
                endTime={endTimeState}
                numGuests={numGuestsState}
                isLoggedIn={isLoggedIn}
                payment={cardState}
              />
              {
                  availState !== null &&
                  <div>
                      <h4 className="title">Availablity:</h4>
                      <div className="avail-tables">
                        <ReactBootstrap.Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Table Size</th>
                                        <th>Tables Available</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    Object.entries(availState).map(printAvail)
                                }
                                </tbody>
                            </ReactBootstrap.Table>
                        </div>
                  </div>
              }
              </form>
          </div>

      </div>
      </div>
  );
}

export default ReserveTable;