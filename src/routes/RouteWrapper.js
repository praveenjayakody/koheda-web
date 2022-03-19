import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { XStorage as xsto } from '../util/XStorage.js'


export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const token = xsto.get("token");
  console.log(token);
  const signed = token !== "" && token !== false;

  /**
   * Redirect user to SignIn page if he tries to access a private route
   * without authentication.
   */
  if (isPrivate && !signed) {
    return <Redirect to="/" />;
  }

  /**
   * Redirect user to Main page if he tries to access a non private route
   * (SignIn or SignUp) after being authenticated.
   */
  if (!isPrivate && signed) {
    return <Redirect to="/buy" />;
  }

  /**
   * If not included on both previous cases, redirect user to the desired route.
   */
  return <Route {...rest} component={Component} />;
}
