import React from "react";
import { Route, useLocation, Redirect } from "react-router-dom";

const PrivateRoute = (props :any) => {
    const location = useLocation();
    const authLogin = localStorage.getItem("accessToken")
  
    if (authLogin === undefined) {
      return null; // or loading indicator/spinner/etc
    }
  
    return authLogin ? (
      <Route {...props} />
    ) : (
      <Redirect
        to={{
          pathname: "/",
          state: { from: location }
        }}
      />
    );
  };

  export default PrivateRoute