import React from 'react';

let TableHeaders = props => {
    const {headers} = props;
    return(
      <thead className="thead-light">
        <tr className="row">
         {headers.map((h) => {
           return (<th className={h.cssClass}>{h.title}</th>);
         })}
        </tr>
      </thead>
    )
}

export default TableHeaders;
