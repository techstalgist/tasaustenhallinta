import React from 'react';

const MonthSelection = (props) => {
    const {months, selectedMonth, handleMonthChange} = props;
    return(
      <div className="form-group">
        <label htmlFor="months"><strong>Kuukausi</strong></label>
        <select onChange={(e) => handleMonthChange(e)} className="form-control p-1" id="months" value={selectedMonth.toString()}>
          {months.map((m) => {
            return (<option value={m.toString()} key={m.toString()}>{m.toString()}</option>);
          })}
        </select>
      </div>
    )
};

export default MonthSelection;
