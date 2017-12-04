import React from 'react';
import {connect} from 'react-redux';
import {hideLoginSuccess} from '../actions';

class UserInfo extends React.Component {

    componentWillUnmount() {
      this.props.dispatch(hideLoginSuccess());
    }

    render() {
      const {user, successMessage} = this.props;
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
}

const mapStateToProps = (state) => (
  {
    user: state.loginData.logInInfo.user,
    successMessage: state.loginData.successMessage
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

UserInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)

export default UserInfo;
