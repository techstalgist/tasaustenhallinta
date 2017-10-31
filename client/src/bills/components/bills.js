import React from 'react';
import BillsTable from './bills-table';

const Bills = props => {

    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col">
              <BillsTable />
            </div>
          </div>
        </div>
      </section>
    )
}

export default Bills;
