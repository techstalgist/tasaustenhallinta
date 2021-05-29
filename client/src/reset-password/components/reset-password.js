import React from 'react';
import { connect } from 'react-redux';
import ResetPasswordForm from './reset-password-form';
import { addToken } from '../actions';

class ResetPassword extends React.Component {

  componentWillMount() {
    const token = this.props.inHeritedToken;
    if (token) {
      this.props.dispatch(addToken(token))
    }
  }

  render() {
    const { successMessage, errorMessage } = this.props;
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

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

ResetPassword = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)

export default ResetPassword;
