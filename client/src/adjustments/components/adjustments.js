import React from 'react';
import AdjustmentsTable from './adjustments-table';

const Adjustments = props => {

    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col">
              <AdjustmentsTable />
            </div>
          </div>
        </div>
      </section>
    )
}

export default Adjustments;
