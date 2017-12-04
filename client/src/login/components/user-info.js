import React from 'react';
import {connect} from 'react-redux';

let UserInfo = props => {
    const {user} = props;
    return(
      <div className="row">
        <div className="col-8">
          <p>Olet kirjautuneena sisään käyttäjänä <strong>{user.username}</strong> käyttäjäryhmässä <strong>{user.userGroupName}</strong>.</p>
        </div>
      </div>
    )
}

const mapStateToProps = (state) => (
  {
    user: state.loginData.logInInfo.user
  }
);

UserInfo = connect(
  mapStateToProps,
  null
)(UserInfo)

export default UserInfo;
