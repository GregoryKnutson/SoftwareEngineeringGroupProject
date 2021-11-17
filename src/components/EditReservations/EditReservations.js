import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import { checkAuth, getUserId } from "../../verifyLogin";
import NavBar from "../NavBar/NavBar";
import NavBarGuest from "../NavBar/NavBarGuest";
import * as ReactBootstrap from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditReservations.scss';
import EditModal from './EditModal';



const Reservations = () => {
    const [isLoggedIn, setLoggedIn] = useState(false)

    let tempReservatons = [ {
        reservationNum: '', reservationsDate: '', reservationStartTime: '', reservationEndTime: '', numGuests: ''
    }]
    const [reservations, setReservations] = useState(tempReservatons)
    useEffect(() => {
        if(checkAuth())
        {
            fetch(`${process.env.API_URL}/api/reservations?token=${localStorage.getItem('token')}&username=${getUserId()}`,
            {
                method: 'GET',
            }
            )
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0){
                    alert("No current reservations.")
                    window.location.assign("/reserve")
                }
                setLoggedIn(true)
                setReservations(data)
            })
        }
    }, [])

    const renderReservation = (res, index) => {
        return(
            <tr key={index}>
                <td>{res.reservationNum}</td>
                <td>{res.reservationDate}</td>
                <td>{res.reservationStartTime}</td>
                <td>{res.reservationEndTime}</td>
                <td>{res.numGuests}</td>
                <td><EditModal obj = {res}/></td>
            </tr>
        )
    }


    return(
      <div>
        <div className="reservations">
            {isLoggedIn
            ? <NavBar></NavBar>
            : <NavBarGuest></NavBarGuest>
            }
                <div className="title">
                    <h1>Reservations</h1>
                </div>
            <div className="reservations__container">
                <ReactBootstrap.Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Reservation Number</th>
                            <th>Reservation Date</th>
                            <th>Reservation Start Time</th>
                            <th>Reservation End Time</th>
                            <th>Number of Guests</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(renderReservation)}
                    </tbody>
                </ReactBootstrap.Table>
            </div>
        </div>
      </div>
  );
}

export default Reservations;