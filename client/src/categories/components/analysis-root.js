import React from 'react';
import PageRoot from '../../shared/components/page-root';
import Analysis from './analysis';

export default class AnalysisRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Analyysi">
        <Analysis />
      </PageRoot>
    )
  }
}
