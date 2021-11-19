import React, { useEffect, useState } from "react";
import { checkAuth, getUserId } from "../../verifyLogin";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-bootstrap-time-picker'
import jwt_decode from "jwt-decode";

const ConfirmModal = (obj) => {

function alertObject(obj){      
    for(var key in obj) {
    alert(obj[key]);
    if( typeof obj[key] === 'object' ) {
        alertObject(obj[key]);
    }
    }
}

  const getTimeString = (seconds) => {
      var date = new Date(0);
      date.setSeconds(seconds)
      var timeString = date.toISOString().substr(11, 8)
      return timeString
  }

    const [open, setOpen] = React.useState(false);
    const [feeState, setFeeState] = useState(0)

    const handleClickOpen = (e) => {
      e.preventDefault()

      const validate = () =>{
        let errors = {};
        if (obj.name == '') errors.name = "Name can not be blank."
        if (obj.name.length > 45) errors.name = "Name is too long."
        if (obj.number.length != 10) errors.number = "Invalid phonenumber."
        if (isNaN(obj.number)) errors.number = "Invalid phonenumber."
        if (obj.number.length == '') errors.email = "Email can not be blank"
        if (obj.email == '') errors.email = "Email can not be blank."
        if (obj.email.length > 45) errors.email = "Email is too long."
        if (obj.numGuests <= 0) errors.guest = "Invalid number of guests."
        if (obj.startTime >= obj.endTime) errors.time = "Starting time can not be greater than or equal to ending time."
        if (obj.date == null) errors.date = "Please select a date."
    
        if (Object.keys(errors) !== 0){
          return errors
        }
      }
      const errors = validate()

       if (Object.keys(errors).length === 0){
        let dayOfTheWeek = obj.date.toString().substr(0, 3)
        let dayString = obj.date.toISOString().substr(0, 10)
        const formData = new FormData();
        formData.append('reservationDay', dayString)
        formData.append('dayOfTheWeek', dayOfTheWeek)
            fetch(`${process.env.API_URL}/api/holiday`,
            {
                method: 'POST',
                body: formData,
            }
            )
            .then((response) => response.json())
            .then((response) => {
                setFeeState(response)
            })
            .catch((error) => {
                console.error('Error: ', error);
            });

            setOpen(true)
        }
       else{
           alertObject(errors)
       }
    };
  
    const handleClose = () => {
      setFeeState(0)
      setOpen(false);
    };

    const handleReserve = (e) => {
          e.preventDefault()
              let dayString = obj.date.toISOString().substr(0, 10)
              let startTime = getTimeString(obj.startTime)
              let endTime = getTimeString(obj.endTime)
          
              const formData = new FormData();
              formData.append('isMember', obj.isLoggedIn)
              formData.append('name', obj.name)
              formData.append('number', obj.number)
              formData.append('email', obj.email)
              formData.append('reservationDay', dayString)
              formData.append('reservationStartTime', startTime)
              formData.append('reservationEndTime', endTime)
              formData.append('numGuests', obj.numGuests)
              formData.append('extraCharge', feeState)
              if(obj.isLoggedIn){
                  formData.append('username', getUserId())
              }
              else{
                formData.append('payment', obj.payment)
              }
        
              fetch(`${process.env.API_URL}/api/reserve`,
              {
                method: 'POST',
                mode: "no-cors",
                body: formData,
              }
            )
              .then(res => {
                console.log({res})
                if(!res.ok) {
                  alert("Error: no available tables to match your request.");
                  throw Error("No available tables.");
                }
                return res.json();
              })
              .then(res => {
                  console.log("Success: ", res);
                  alert("Thank you! Submission Complete!")
                  window.location.assign("/reservations")
              })
              .catch((error) => {
                console.error(error);
              })
              setOpen(false)
    }
    
    return(
        <div>
              <div className="button">
                  <input 
                      className="reserveButton"
                      type= "submit" 
                      value="Reserve"
                      onClick={handleClickOpen}
                  />
              </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="edit-data-form">Confirm Reservation:</DialogTitle>
          <DialogContent>
            {feeState != 0 &&
                <DialogContentText id="alert-dialog-description">
                    You have an extra fee of ${feeState}
                </DialogContentText>
            }
          <DialogContentText id="alert-dialog-description">
              Missing your reservation will be a fine of $20.
          </DialogContentText>
        </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleReserve} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default ConfirmModal;