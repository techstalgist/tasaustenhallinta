import React from 'react';
import {connect} from 'react-redux';
import ResetPasswordForm from './reset-password-form';

class ResetPassword extends React.Component {

  render() {
    const {successMessage, errorMessage} = this.props;
    return(
      <div className="row">
        <div className="col-8">
          
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
          <ResetPasswordForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    successMessage: state.resetPasswordData.successMessage,
    errorMessage: state.resetPasswordData.errorMessage
  }
);

ResetPassword = connect(
  mapStateToProps,
  null
)(ResetPassword)

export default ResetPassword;
