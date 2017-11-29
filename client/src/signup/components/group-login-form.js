import React from 'react';
import { Field, reduxForm, getFormValues } from 'redux-form';
import {connect} from 'react-redux';
import { submitGroupLogin } from '../actions';

let GroupLoginForm = props => {
    const {handleSubmit} = props;
    return(
      <form onSubmit={handleSubmit}>
        <div>
          <label>Käyttäjäryhmän nimi</label>
          <div>
            <Field name="name" component="input" type="text" />
          </div>
        </div>
        <div className="mb-2">
          <label>Salasana</label>
          <div>
            <Field name="password" component="input" type="password" />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary">Kirjaudu sisään käyttäjäryhmään</button>
        </div>
    </form>
    )
}

GroupLoginForm = reduxForm({
  form: 'GroupLogin'
})(GroupLoginForm);

const mapDispatchToProps = (dispatch) => (
  {
    onSubmit: (values) => (
      dispatch(submitGroupLogin(values))
    )
  }
);

const mapStateToProps = (state) => (
  {
    initialValues: getFormValues('GroupLogin')(state)
  }
);

GroupLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupLoginForm)

export default GroupLoginForm;
