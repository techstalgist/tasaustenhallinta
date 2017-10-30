import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitLogin } from '../actions';

let LoginForm = props => {
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
          <button type="submit" className="btn btn-primary">Kirjaudu sisään</button>
        </div>
    </form>
    )
}

LoginForm = reduxForm({
  form: 'Login'
})(LoginForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitLogin(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('Login')(state)
  }
);

LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)

export default LoginForm;
