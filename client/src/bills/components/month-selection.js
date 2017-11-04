import React from 'react';

const MonthSelection = (props) => {
    const {months, selectedMonth, handleChange} = props;
    return(
      <div className="form-group">
        <label htmlFor="months"><strong>Kuukausi</strong></label>
        <select onChange={(e) => handleChange(e)} className="form-control" id="months" defaultValue={selectedMonth.toString()}>
          {months.map((m) => {
            return (<option value={m.toString()} key={m.toString()}>{m.toString()}</option>);
          })}
        </select>
      </div>
    )
};

export default MonthSelection;