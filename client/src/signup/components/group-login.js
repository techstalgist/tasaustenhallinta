import React from 'react';
import {connect} from 'react-redux';
import GroupLoginForm from './group-login-form';
import {Redirect} from 'react-router-dom';

class GroupLogin extends React.Component {

  render() {
    const {successMessage, errorMessage, loggedIntoGroup} = this.props;
    if (loggedIntoGroup) {
      return (
        <Redirect to="/auth/signup" />
      )
    }
    return(
      <div className="row">
        <div className="col-6">
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
          <p>Sinun täytyy kirjautua sisään käyttäjäryhmään voidaksesi luoda uuden käyttäjän ko. ryhmään.</p>
        {<GroupLoginForm />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    successMessage: state.signUpData.successMessage,
    errorMessage: state.signUpData.errorMessage,
    loggedIntoGroup: state.signUpData.loggedIntoGroup
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
)

GroupLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupLogin)

export default GroupLogin;
