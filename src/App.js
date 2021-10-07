import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import { PrivateRoute } from "./verifyLogin"
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import ReserveTable from './components/ReserveTable/ReserveTable'
import UserInfo from "./components/UserInfo/UserInfo";
import GuestInfo from "./components/GuestInfo/GuestInfo";

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/reserve" />
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile" component={UserInfo} />
        <Route path="/guest" component={GuestInfo} />
        <Route path="/reserve" component={ReserveTable} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;