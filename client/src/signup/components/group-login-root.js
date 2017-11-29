import React from 'react';
import PageRoot from '../../shared/components/page-root';
import GroupLogin from './group-login';

export default class GroupLoginRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Käyttäjäryhmään kirjautuminen">
        <GroupLogin />
      </PageRoot>
    )
  }
}
