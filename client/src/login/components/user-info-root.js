import React from 'react';
import PageRoot from '../../shared/components/page-root';
import UserInfo from './user-info';

export default class UserInfoRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Käyttäjän tiedot">
        <UserInfo />
      </PageRoot>
    )
  }
}
