import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom"; 

const ProtectedRoute = ({ isAdmin, element: Elements, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          element={ 
            (props) => {
              if (isAuthenticated === false) {
                return <Navigate to="/login" />;
              }

              if (isAdmin === true && user.role !== "admin") {
                return <Navigate to="/admin/dashboard" />;
              }
              
              return <Elements {...props} />;
            }
          }
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;
