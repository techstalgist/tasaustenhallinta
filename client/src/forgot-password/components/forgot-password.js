import React from 'react';
import {connect} from 'react-redux';
import ForgotPasswordForm from './forgot-password-form';

class ForgotPassword extends React.Component {

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
          <ForgotPasswordForm />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  {
    successMessage: state.forgotPasswordData.successMessage,
    errorMessage: state.forgotPasswordData.errorMessage
  }
);

ForgotPassword = connect(
  mapStateToProps,
  null
)(ForgotPassword)

export default ForgotPassword;
