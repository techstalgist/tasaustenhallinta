import React from 'react';
import {connect} from 'react-redux';
import { submitLogout } from '../actions';
import {Redirect, Link} from 'react-router-dom';

let Logout = props => {
    const {handleLogout, loggedIn} = props;
    if (!loggedIn) {
      return (<Redirect to="/login"/>)
    }
    return(
      <Link onClick={handleLogout} key="/logout" className="nav-item nav-link" to="/logout">Kirjaudu ulos</Link>
    )
}

const mapStateToProps = (state) => (
  {
    loggedIn: state.loginData.logInInfo.loggedIn,
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
