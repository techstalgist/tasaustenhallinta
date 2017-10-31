import React from 'react';
import CategoriesTable from './categories-table';

const Categories = props => {

    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col">
              <CategoriesTable />
            </div>
          </div>
        </div>
      </section>
    )
}

export default Categories;
