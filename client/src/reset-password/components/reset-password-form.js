import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitResetPassword } from '../actions';

let ResetPasswordForm = props => {
    const {handleSubmit} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div>
          <label>Uusi salasana</label>
          <div className="mb-2">
            <Field name="password" component="input" type="password" />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Aseta uusi salasana</button>
        </div>
    </form>
    )
}

ResetPasswordForm = reduxForm({
  form: 'ResetPassword'
})(ResetPasswordForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitResetPassword(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('ResetPassword')(state)
  }
);

ResetPasswordForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordForm)

export default ResetPasswordForm;
