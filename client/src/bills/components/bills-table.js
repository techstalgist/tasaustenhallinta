import React from 'react';
import {connect} from 'react-redux';
import { fetchBills, changeMonth } from '../actions';
import { getBillsForSelectedMonth } from '../selectors';
import { toFinnishDateString } from '../../shared/helpers';
import MonthSelection from './month-selection';
import AmountsForUsers from './amounts-for-users';

class BillsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchBills());
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.changeMonth(e.target.value);
  }

  render() {
    const { bills, months, selectedMonth } = this.props;
    const billsForSelectedMonth = getBillsForSelectedMonth(bills, selectedMonth);
    const headers = (
      <thead className="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Käyttäjä</th>
          <th scope="col">Summa</th>
          <th scope="col">Kategoria</th>
          <th scope="col">Pvm (pp.kk.vvvv)</th>
        </tr>
      </thead>
    );
    return (
      <div>
        <div className="row">
          <div className="col-2">
            <MonthSelection months={months} selectedMonth={selectedMonth} handleChange={this.handleChange}/>
          </div>
          <div className="col-8">
            <AmountsForUsers bills={billsForSelectedMonth} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
          <table className="table">
            {headers}
            <tbody>
            {billsForSelectedMonth.length > 0 ? billsForSelectedMonth.map((b, i) =>
              (
                <tr key={b.id} id={b.id}>
                    <th scope="row">
                      {i+1}
                    </th>
                    <td>
                      {b.username}
                    </td>
                    <td>
                      <input type="number" name="amount"
                          defaultValue={b.amount}
                          className="text-right"/>
                    </td>
                    <td>
                      {b.categoryname}
                    </td>
                    <td>
                    <input type="text" name="date"
                        defaultValue={toFinnishDateString(b.date)}
                        className="text-right"/>
                    </td>
                </tr>
              )) : null}
            </tbody>
          </table>
          </div>
        </div>
        <button type="button" className="btn btn-primary">Lisää uusi lasku</button>
        <button type="button" className="btn btn-primary ml-1">Tallenna uudet laskut</button>
        <button type="button" className="btn btn-primary ml-1">Päivitä vanhat laskut</button>
      </div>
    )
  }
}



const mapStateToProps = (state) => (
  {
    bills: state.billsData.bills,
    dataReceived: state.billsData.dataReceived,
    successMessage: state.billsData.successMessage,
    months: state.billsData.months,
    selectedMonth: state.billsData.selectedMonth
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    changeMonth: (newMonth) => {
      dispatch(changeMonth(newMonth))
    }
  }
);

BillsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(BillsTable);

export default BillsTable;
