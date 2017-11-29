import React from 'react';
import PageRoot from '../../shared/components/page-root';
import SignUp from './signup';

export default class SignUpRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Käyttäjän luonti">
        <SignUp />
      </PageRoot>
    )
  }
}
