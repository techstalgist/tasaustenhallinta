import React from 'react';
import PageRoot from '../../shared/components/page-root';
import Categories from './categories';

export default class CategoriesRoot extends React.Component {

  render() {
    return(
      <PageRoot heading="Kategoriat">
        <Categories />
      </PageRoot>
    )
  }
}
