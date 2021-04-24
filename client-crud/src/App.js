import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import auth from './auth';
import Login from './components/Login';
import Products from './components/Products';
import UpdateProduct from './components/UpdateProduct';

const PrivateRoute = ({ component: Component, auth: Auth, ...rest }) => (
  <Route {...rest} render={(props) => (
    Auth.checkLogin() === true
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <PrivateRoute exact path="/products" component={Products} auth={auth} />
        <PrivateRoute exact path="/products/update" component={UpdateProduct} auth={auth} />
      </Switch>
    </Router >
  );
}