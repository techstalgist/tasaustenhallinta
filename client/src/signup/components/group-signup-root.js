import React from 'react';
import PageRoot from '../../shared/components/page-root';
import GroupSignUp from './group-signup';

export default class GroupSignUpRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Käyttäjäryhmän luonti">
        <GroupSignUp />
      </PageRoot>
    )
  }
}
