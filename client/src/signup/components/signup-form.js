import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitSignup } from '../actions';

let SignUpForm = props => {
    const {handleSubmit, userGroup} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
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
        <div className="mb-2">
          <label>Sähköposti</label>
          <div>
            <Field name="email" component="input" type="text" />
          </div>
        </div>
        <div className="mb-3">
          <label>Käyttäjäryhmä</label>
          <div>
            <strong>{userGroup.name}</strong>
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Luo uusi käyttäjä käyttäjäryhmään</button>
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
    initialValues: getFormValues('SignUp')(state),
    userGroup: state.signUpData.userGroup
  }
);

SignUpForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpForm;
