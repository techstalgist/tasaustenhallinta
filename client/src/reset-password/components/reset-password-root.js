import React from 'react';
import PageRoot from '../../shared/components/page-root';
import ResetPassword from './reset-password';

export default class ResetPasswordRoot extends React.Component {

  render() {
    const { match: { params } } = this.props;
    return(
      <PageRoot heading="Salasanan resetointi">
        <ResetPassword inHeritedToken={params.token} />
      </PageRoot>
    )
  }
}
