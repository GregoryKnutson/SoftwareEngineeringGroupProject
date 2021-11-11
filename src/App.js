import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import { PrivateRoute } from "./verifyLogin"
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import ReserveTable from './components/ReserveTable/ReserveTable'
import UserInfo from "./components/UserInfo/UserInfo";
import GuestInfo from "./components/GuestInfo/GuestInfo";
import Reservations from "./components/EditReservations/EditReservations";

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile" component={UserInfo} />
        <Route path="/guest" component={GuestInfo} />
        <Route path="/reserve" component={ReserveTable} />
        <Route path="/reservations" component={Reservations} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;