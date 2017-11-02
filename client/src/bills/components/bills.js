import React from 'react';
import BillsTable from './bills-table';

const Bills = props => {

    return(
      <div className="row">
        <div className="col">
          <BillsTable />
        </div>
      </div>
    )
}

export default Bills;
