import React from 'react';
import {connect} from 'react-redux';
import LoginForm from './login-form';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {

  render() {
    const {from, loggedIn, errorMessage} = this.props;
    const fromText = from.length === 0 ? "Kirjaudu sisään." : "Sinun täytyy kirjautua sisään nähdäksesi sivun, jonka osoite on " + from + ".";
    if (loggedIn) {
      return (
        <Redirect to="/auth/user" />
      )
    }
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
         {errorMessage
           ? <div className="alert alert-danger" role="alert">
               {errorMessage}
             </div>
           : null
          }
        <LoginForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    loggedIn: state.loginData.logInInfo.loggedIn,
    errorMessage: state.loginData.errorMessage
  }
);

Login = connect(
  mapStateToProps,
  null
)(Login)

export default Login;
