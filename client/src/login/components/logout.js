import React from 'react';
import {connect} from 'react-redux';
import { submitLogout } from '../actions';

let Logout = props => {
    const {handleLogout, user} = props;
    return(
      <div>
        <p>Olet kirjautuneena sisään käyttäjänä <strong>{user.username}</strong>.</p>
        <button type="button" className="btn btn-primary" onClick={handleLogout}>Kirjaudu ulos</button>
      </div>
    )
}

const mapStateToProps = (state) => (
  {
    user: state.loginData.logInInfo.user
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    handleLogout: (values) => (
      dispatch(submitLogout(values))
    )
  }
);

Logout = connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout)

export default Logout;
