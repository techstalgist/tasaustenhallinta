import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitForgotPassword } from '../actions';

let ForgotPasswordForm = props => {
    const {handleSubmit} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sähköposti</label>
          <div className="mb-2">
            <Field name="email" component="input" type="text" />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Lähetä linkki sähköpostiin</button>
        </div>
    </form>
    )
}

ForgotPasswordForm = reduxForm({
  form: 'ForgotPassword'
})(ForgotPasswordForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitForgotPassword(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('ForgotPassword')(state)
  }
);

ForgotPasswordForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordForm;
