import React from 'react';
import {connect} from 'react-redux';
import GroupSignUpForm from './group-signup-form';
import {Redirect} from 'react-router-dom';

class GroupSignUp extends React.Component {

  render() {
    const {loggedIntoGroup, errorMessage,successMessage} = this.props;
    if (loggedIntoGroup) {
      return (
        <Redirect to="/auth/signup" />
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
          <GroupSignUpForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    errorMessage: state.signUpData.errorMessage,
    loggedIntoGroup: state.signUpData.loggedIntoGroup,
    successMessage: state.signUpData.successMessage
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
)

GroupSignUp = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSignUp)

export default GroupSignUp;
