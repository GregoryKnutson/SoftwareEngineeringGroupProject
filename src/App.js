import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import ReserveTable from './components/ReserveTable/ReserveTable'

const App = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/table" component={ReserveTable} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;