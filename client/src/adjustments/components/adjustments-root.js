import React from 'react';
import PageRoot from '../../shared/components/page-root';
import Adjustments from './adjustments';

export default class AdjustmentsRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Tasaukset">
        <Adjustments />
      </PageRoot>
    )
  }
}
