import React, { useEffect, useState } from "react";
import { Redirect, Link } from 'react-router-dom';
import { checkAuth, getUserId } from "../../verifyLogin";
import NavBar from "../NavBar/NavBar";
import NavBarGuest from "../NavBar/NavBarGuest"
import * as ReactBootstrap from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './EditReservations.scss'
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const EditModal = ({obj}) => {
    const [open, setOpen] = React.useState(false);
    const [songNameState, setSongNameState] = useState(obj.songName);

    const handleClickOpen = () => {
      console.log(obj);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleSubmission = () => {
        return
      };
    
  

    return(
        <div>
        <IconButton>
          <EditIcon onClick={handleClickOpen}></EditIcon>
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="edit-data-form">Edit Reservation:</DialogTitle>
          <DialogContent>
            <label>Reservation Date: </label>
            <input
              type="text"
              name="songName"
              value={songNameState}
              onChange={(e) => setSongNameState(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <label>Start Time: </label>
            <input
              type="text"
              name="songName"
              value={songNameState}
              onChange={(e) => setSongNameState(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <label>End Time: </label>
            <input
              type="text"
              name="songName"
              value={songNameState}
              onChange={(e) => setSongNameState(e.target.value)}
            />
          </DialogContent>
          <DialogContent>
            <label>Number of Guests: </label>
            <input
              type="text"
              name="songName"
              value={songNameState}
              onChange={(e) => setSongNameState(e.target.value)}
            />
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