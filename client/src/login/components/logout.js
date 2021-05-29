import React from 'react';
import {connect} from 'react-redux';
import { submitLogout } from '../actions';
import {Link} from 'react-router-dom';

let Logout = props => {
    const {handleLogout, loggedIn} = props;
    if (!loggedIn) {
      // cannot use Redirect to login here. Otherwise all direct links (e.g. password reset) will not work, 
      // instead they will also redirect to /login.
      return (<div></div>)
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
