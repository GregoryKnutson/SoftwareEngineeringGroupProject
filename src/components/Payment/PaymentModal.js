import React, { useEffect, useState } from "react";
import { checkAuth, getUserId } from "../../verifyLogin";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import 'react-datepicker/dist/react-datepicker.css'
import { Button, Form, Alert, Row, Col } from "react-bootstrap";
import Cards from "react-credit-cards";
import "./PaymentModal.scss"
import "react-credit-cards/es/styles-compiled.css";

import valid from "card-validator";

const PaymentModal = ({handleChange, handleFocus, values, cardAdded, setCardAdded, setCardUpdated}) => {

    const [open, setOpen] = React.useState(false);
    const [cardErrors, setCardErrors] = useState({        
      show: false,
      variant: "danger",
      message: "",
      cname: false,
      cnumber: false,
      cexp: false,
      ccvv: false
  })

  function validateInfo(values) {
    let cardErrors = {};
    let creditCard = valid.number(values.cardNumber);
  
    creditCard.expirationDate = valid.expirationDate(values.cardExpiration);
    creditCard.cvv = valid.cvv(values.cardSecurityCode);
    creditCard.cardholderName = valid.cardholderName(values.cardName);
  
    cardErrors.show = true;
    cardErrors.variant = "danger";
    cardErrors.message = "An unknown error occured. Please try again later"
    cardErrors.cname = false;
    cardErrors.cnumber = false;
    cardErrors.cexp = false;
    cardErrors.ccvv = false;
  
    //Card CVV expiration
    if (values.cardSecurityCode === null || !values.cardSecurityCode.trim()) {
      cardErrors.message = "Credit card CVC is not complete";
    } else if (creditCard.cvv.isValid) {
      cardErrors.ccvv = true;
    } else {
      cardErrors.message = "Credit card CVC is invalid";
    }
  
    //Card Expiration Verification
    if (values.cardExpiration === null || !values.cardExpiration.trim()) {
      cardErrors.message = "Credit card expiration date is not complete";
    } else if (creditCard.expirationDate.isValid) {
      cardErrors.cexp = true;
    } else {
      cardErrors.message = "Credit card expiration date is invalid";
    }
  
  
    //Card Number Verification
    if (values.cardNumber === null || !values.cardNumber.trim()) {
      cardErrors.message = "Credit card number is not complete";
    } else if (creditCard.isValid) {
      cardErrors.cnumber = true;
    } else {
      cardErrors.message = "Credit card number is invalid";
    }
  
    //Cardholder Name Verification
    if (values.cardName === null || !values.cardName.trim()) {
      cardErrors.message = "Cardholder name is not complete";
    } else if (creditCard.cardholderName.isValid) {
      cardErrors.cname = true;
    } else {
      cardErrors.message = "Cardholder name is invalid";
    }
  
    if (
      cardErrors.cname &&
      cardErrors.cnumber &&
      cardErrors.cexp &&
      cardErrors.ccvv
    ) {
      cardErrors.variant = "success";
      cardErrors.message = "Credit Card is valid";
    }

    setCardErrors(cardErrors)
    return cardErrors.variant
  }


    const handleCardValidate = e => {
      e.preventDefault()
      var variant = validateInfo(values)
      if (variant == "success"){
        setCardAdded(true)
        setCardUpdated(true)
        handleClose()
      }
  };

    const handleClickOpen = (e) => {
      e.preventDefault()
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    
    return(
        <div>
          <div className = "cardContainer">
          <div className="button">
            <input
              className="cardButton"
              type="button"
              value="Add Card"
              onClick={handleClickOpen}
            />
          </div>
          {
            !cardAdded ?
            <p className= "cardMessage">No Card Added</p>
            : <p className= "cardMessage">Card Added!</p>
          }
          </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="edit-data-form">Card Info</DialogTitle>
          <div className="creditCard">
          <Cards
            cvc={values.cardSecurityCode}
            expiry={values.cardExpiration}
            focused={values.focus}
            name={values.cardName}
            number={values.cardNumber}
          />
          </div>
          <Form>
            <Form.Group>
              <Form.Control
                type="text"
                id="cardName"
                data-testid="cardName"
                name="cardName"
                placeholder="Cardholder Name"
                value={values.cardName}
                onChange={handleChange}
                onFocus={handleFocus}
                isValid={cardErrors.cname}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="number"
                id="cardNumber"
                data-testid="cardNumber"
                name="cardNumber"
                placeholder="Card Number"
                value={values.cardNumber}
                onChange={handleChange}
                onFocus={handleFocus}
                isValid={cardErrors.cnumber}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Control
                    type="text"
                    id="cardExpiration"
                    data-testid="cardExpiration"
                    name="cardExpiration"
                    placeholder="Expiration Date"
                    value={values.cardExpiration}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    isValid={cardErrors.cexp}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Control
                    type="number"
                    id="cardSecurityCode"
                    data-testid="cardSecurityCode"
                    name="cardSecurityCode"
                    placeholder="Security Code"
                    value={values.cardSecurityCode}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    isValid={cardErrors.ccvv}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Alert
            id="alertMessage"
            data-testid="alertMessage"
            variant={cardErrors.variant}
            show={cardErrors.show}
          >
            {cardErrors.message}
          </Alert>{" "}
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              size={"block"}
              data-testid="validateButton"
              id="validateButton"
              type="button"
              onClick={handleCardValidate}
            >
              Validate
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

export default PaymentModal;