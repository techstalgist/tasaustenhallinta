import React from 'react';
import {connect} from 'react-redux';
import SignUpForm from './signup-form';
import {hideSignUpMessages} from '../actions';
import {Redirect} from 'react-router-dom';

class SignUp extends React.Component {

  componentWillUnmount() {
    this.props.dispatch(hideSignUpMessages());
  }

  render() {
    const {loggedIn, errorMessage,successMessage} = this.props;
    if (loggedIn) {
      return (
        <Redirect to="/auth/user" />
      )
    }
    return(
      <div className="row">
        <div className="col-6">
         {errorMessage
           ? <div className="alert alert-danger" role="alert">
               {errorMessage}
             </div>
           : null
          }
          {successMessage
            ? <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            : null
           }
          <SignUpForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    errorMessage: state.signUpData.errorMessage,
    loggedIn: state.loginData.logInInfo.loggedIn,
    successMessage: state.signUpData.successMessage
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
)

SignUp = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp)

export default SignUp;
