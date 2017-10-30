import React from 'react';
import PageRoot from '../../shared/components/page-root';
import Login from './login';

export default class LoginRoot extends React.Component {

  render() {
    const from = this.props.location.state !== undefined ? this.props.location.state.from : "";
    return(
      <PageRoot heading="Kirjautuminen">
        <Login from={from}/>
      </PageRoot>
    )
  }
}
