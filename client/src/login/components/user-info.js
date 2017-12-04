import React from 'react';
import {connect} from 'react-redux';

let UserInfo = props => {
    const {user, successMessage} = props;
    return(
      <div className="row">
        <div className="col-8">
            {successMessage
              ? <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              : null
             }
          <p>Olet kirjautuneena sisään käyttäjänä <strong>{user.username}</strong> käyttäjäryhmässä <strong>{user.userGroupName}</strong>.</p>
        </div>
      </div>
    )
}

const mapStateToProps = (state) => (
  {
    user: state.loginData.logInInfo.user,
    successMessage: state.loginData.successMessage
  }
);

UserInfo = connect(
  mapStateToProps,
  null
)(UserInfo)

export default UserInfo;
