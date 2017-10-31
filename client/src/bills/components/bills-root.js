import React from 'react';
import PageRoot from '../../shared/components/page-root';
import Bills from './bills';

export default class AdjustmentsRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Laskut">
        <Bills />
      </PageRoot>
    )
  }
}
