import React from 'react';
import {connect} from 'react-redux';
import {hideLoginSuccess} from '../actions';
import TableHeaders from '../../shared/components/table/table-headers';

class UserInfo extends React.Component {

    componentWillUnmount() {
      this.props.dispatch(hideLoginSuccess());
    }

    render() {
      const {user, successMessage} = this.props;
      const headersData = [
        {cssClass: "", title: "Käyttäjä"},
        {cssClass: "", title: "Sähköposti"},
        {cssClass: "", title: "Käyttäjäryhmä"}
      ];
      return(
        <div className="row">
          <div className="col-8">
              {successMessage
                ? <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                : null
               }
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass=""/>
              <tbody>
                  <tr>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.userGroupName}</td>
                  </tr>
              </tbody>
            </table>
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
