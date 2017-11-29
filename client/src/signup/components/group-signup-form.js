import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitGroupSignup } from '../actions';

let GroupSignUpForm = props => {
    const {handleSubmit} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Käyttäjäryhmän nimi</label>
          <div>
            <Field name="name" component="input" type="text" />
          </div>
        </div>
        <div className="mb-3">
          <label>Salasana</label>
          <div>
            <Field name="password" component="input" type="password" />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Luo uusi käyttäjäryhmä</button>
        </div>
    </form>
    )
}

GroupSignUpForm = reduxForm({
  form: 'GroupSignUp'
})(GroupSignUpForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitGroupSignup(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('GroupSignUp')(state)
  }
);

GroupSignUpForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSignUpForm)

export default GroupSignUpForm;
