import React from 'react';
import {connect} from 'react-redux';
import { submitLogout } from '../actions';

let Logout = props => {
    const {handleLogout} = props;
    return(
      <button type="button" className="btn btn-primary" onClick={handleLogout}>Kirjaudu ulos</button>
    )
}

const mapDispatchToProps = (dispatch) => (
  {
    handleLogout: (values) => (
      dispatch(submitLogout(values))
    )
  }
);

Logout = connect(
  null,
  mapDispatchToProps
)(Logout)

export default Logout;
