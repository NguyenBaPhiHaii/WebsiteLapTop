import React, { Fragment, useState, useEffect } from "react";
import "./ResetPassword.css";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, resetPassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import IconButton from "@material-ui/core/IconButton"; 
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff"; 
import { useLocation } from "react-router-dom"; 

const ResetPassword = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const location = useLocation(); 
  const navigate = useNavigate();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const pathname = location.pathname;

    const tokenMatch = pathname.match(/\/reset\/([^/]+)/);

    if (tokenMatch && tokenMatch[1]) {
      const token = tokenMatch[1];

      const myForm = new FormData();

      myForm.set("password", password);
      myForm.set("confirmPassword", confirmPassword);

      dispatch(resetPassword(token, myForm));
    } else {
      alert.error("Invalid token.");
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Password Updated Successfully");

      navigate("/login");
    }
  }, [dispatch, error, alert, navigate, success]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Change Password" />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Profile</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div className="passwordInput">
                  <LockOpenIcon />
                  <input
                    type={showPassword ? "text" : "password"} 
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <span className="show-password-icons">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon /> 
                        ) : (
                          <VisibilityIcon /> 
                        )}
                      </IconButton>
                    </span>
                  )}
                </div>
                <div className="passwordInput">
                  <LockIcon />
                  <input
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && (
                    <span className="show-password-icon">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon /> 
                        ) : (
                          <VisibilityIcon /> 
                        )}
                      </IconButton>
                    </span>
                  )}
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
