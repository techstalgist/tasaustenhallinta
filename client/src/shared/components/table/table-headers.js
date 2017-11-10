import React from 'react';

let TableHeaders = props => {
    const {headers, rowClass} = props;
    return(
      <thead className="thead-light">
        <tr className={rowClass}>
         {headers.map((h) => {
           return (<th className={h.cssClass} key={h.title}>{h.title}</th>);
         })}
        </tr>
      </thead>
    )
}

export default TableHeaders;
