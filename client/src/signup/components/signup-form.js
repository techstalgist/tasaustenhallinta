import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitSignup } from '../actions';

let SignUpForm = props => {
    const {handleSubmit} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div>
          <label>Käyttäjänimi</label>
          <div>
            <Field name="username" component="input" type="text" />
          </div>
        </div>
        <div className="mb-2">
          <label>Salasana</label>
          <div>
            <Field name="password" component="input" type="password" />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Rekisteröidy</button>
        </div>
    </form>
    )
}

SignUpForm = reduxForm({
  form: 'SignUp'
})(SignUpForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitSignup(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('SignUp')(state)
  }
);

SignUpForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpForm;
