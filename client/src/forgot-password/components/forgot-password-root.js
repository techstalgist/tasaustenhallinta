import React from 'react';
import PageRoot from '../../shared/components/page-root';
import ForgotPassword from './forgot-password';

export default class ForgotPasswordRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Unohtunut salasana">
        <ForgotPassword/>
      </PageRoot>
    )
  }
}
