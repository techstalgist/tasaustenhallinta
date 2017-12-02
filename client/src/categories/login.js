import React from 'react';
import {connect} from 'react-redux';
import LoginForm from './login-form';
import Logout from './logout';
import {hideLoginSuccess} from '../actions';

class Login extends React.Component {
  componentWillUnmount() {
    this.props.dispatch(hideLoginSuccess());
  }

  render() {
    const {from, loggedIn, successMessage, errorMessage} = this.props;
    const fromText = from.length === 0 ? "Kirjaudu sisään." : "Sinun täytyy kirjautua sisään nähdäksesi sivun, jonka osoite on " + from + ".";
    return(
      <div className="row">
        <div className="col-8">
      {
        !loggedIn ?
        <p>
          {fromText}
        </p>
        : null
      }
        {successMessage
          ? <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          : null
         }
         {errorMessage
           ? <div className="alert alert-danger" role="alert">
               {errorMessage}
             </div>
           : null
          }
        {!loggedIn ? <LoginForm /> : <Logout />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    loggedIn: state.loginData.logInInfo.loggedIn,
    successMessage: state.loginData.successMessage,
    errorMessage: state.loginData.errorMessage
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
)

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default Login;
