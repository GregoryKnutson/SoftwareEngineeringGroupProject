import React, { useEffect, useState } from "react";
import { checkAuth, getUserId } from "../../verifyLogin";
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditReservations.scss'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import TimePicker from 'react-bootstrap-time-picker'

const EditModal = ({obj}) => {
  function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

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

  const validate = () =>{
    let errors = {};
    if (numGuestsState <= 0) errors.guest = "Invalid number of guests."
    if (startTimeState >= endTimeState) errors.time = "Starting time can not be greater than or equal to ending time."
    if (dateState == null) errors.date = "Please select a date."

    if (Object.keys(errors) !== 0){
      return errors
    }
  }
    const [open, setOpen] = React.useState(false);
    const [reservationNum, setReservationNum] = useState(null);
    const [dateState, setDateState] = useState(null)
    const [startTimeState, setStartTimeState] = useState(null)
    const [endTimeState, setEndTimeState] = useState(null)
    const [numGuestsState, setNumGuestsState] = useState(null)
    const nothing = () => {}

    const handleClickOpen = (e) => {
      e.preventDefault()
      setReservationNum(obj.reservationNum)
      var resDate = new Date(obj.reservationDate)
      setDateState(resDate)
      setStartTimeState(hmsToSecondsOnly(obj.reservationStartTime))
      setEndTimeState(hmsToSecondsOnly(obj.reservationEndTime))
      setNumGuestsState(obj.numGuests)
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleSubmission = () => {
      const errors = validate();

      if (Object.keys(errors).length === 0){
          let dayOfTheWeek = dateState.toString().substr(0, 3)
          let dayString = dateState.toISOString().substr(0, 10)
          let startTime = getTimeString(startTimeState)
          let endTime = getTimeString(endTimeState)
      
          const formData = new FormData();
          formData.append('isMember', "True")
          formData.append('reservationDay', dayString)
          formData.append('reservationStartTime', startTime)
          formData.append('reservationEndTime', endTime)
          formData.append('numGuests', numGuestsState)
          formData.append('dayOfTheWeek', dayOfTheWeek)
          formData.append('username', getUserId())
    
          fetch(
            `${process.env.API_URL}/api/editReservation`,
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



    };
    
    return(
        <div>
        <IconButton onClick={handleClickOpen}>
          <EditIcon></EditIcon>
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="edit-data-form">Edit Reservation:</DialogTitle>
          <DialogContent>
          <div className= "in">
                  <label>Reservation Number:</label>
                  <input className="nameInput"
                      type="text"
                      name="idnum"
                      id="idnum"
                      readOnly={!!reservationNum}
                      value={reservationNum}
                      onChange={reservationNum ? nothing : setReservationNum}
                  />
          </div>
          </DialogContent>
          <DialogContent>
          <div className= "in">
                  <div className = "reservationDayModal">
                        <label>Reservation Day:</label>
                            <DatePicker
                                name="reservationDate"
                                id="reservationDate"
                                onChange={setDateState}
                                withPortal
                                selected={dateState}
                                minDate={new Date()}
                            />
                    </div>
              </div>
          </DialogContent>
          <DialogContent>
          <div className= "in">
          <div className = "reservationTimeModal">
                          <label>Reservation Starting Time:</label>
                          <TimePicker
                          start="10:00"
                          end="22:00"
                          onChange={setStartTimeState}
                          value={startTimeState}
                          />
                      </div>
              </div>
          </DialogContent>
          <DialogContent>
          <div className= "in">
          <div className = "reservationTimeModal">
                          <label>Reservation Ending Time:</label>
                          <TimePicker
                          start="10:00"
                          end="22:00"
                          onChange={setEndTimeState}
                          value={endTimeState}
                          />
                      </div>
              </div>
          </DialogContent>
          <DialogContent>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmission} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default EditModal;