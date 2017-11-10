import React from 'react';
import {connect} from 'react-redux';
import { fetchBills, changeMonth, addBill, createBills, updateBills } from '../actions';
import { getBillsForSelectedMonth } from '../selectors';
import { toFinnishDateString } from '../../shared/helpers';
import { handleUserChange, handleAmountChange, handleDateChange, handleCategoryChange } from '../../shared/components/table/change-handlers';
import MonthSelection from './month-selection';
import AmountsForUsers from './amounts-for-users';
import TableHeaders from '../../shared/components/table/table-headers';
import UserDropdown from '../../shared/components/table/user-dropdown';
import {changeAttribute } from '../../shared/actions';

class BillsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchBills());
    }
  }

  handleMonthChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.changeMonth(e.target.value);
  }

  render() {
    const { addBill, createBills, updateBills, bills, users, months, selectedMonth, categories, handleAttributeChange, successMessage } = this.props;
    const billsForSelectedMonth = getBillsForSelectedMonth(bills, selectedMonth);
    const headersData = [
      {cssClass: "col-2", title: "#"},
      {cssClass: "col-2", title: "Käyttäjä"},
      {cssClass: "col-3 text-right", title: "Summa"},
      {cssClass: "col-2", title: "Kategoria"},
      {cssClass: "col-3 text-right", title: "Pvm (pp.kk.vvvv)"},
    ];
    const target = "bill";
    return (
      <div>
        <div className="row">
          <div className="col-2">
            <MonthSelection months={months} selectedMonth={selectedMonth} handleMonthChange={this.handleMonthChange}/>
          </div>
          <div className="col-5">
            <AmountsForUsers bills={billsForSelectedMonth} />
          </div>
        </div>
        <div className="row">
          <div className="col-10">
          <table className="table table-sm border">
            <TableHeaders headers={headersData} rowClass="table-row"/>
            <tbody>
            {billsForSelectedMonth.length > 0 ? billsForSelectedMonth.map((b, i) =>
              (
                <tr key={b.id} id={b.id} className="table-row">
                    <th className="col-2">
                      {i+1} {b.newbill ? <span className="badge badge-secondary">Uusi</span> : null}
                    </th>
                    <td className="col-2">
                      <UserDropdown next={handleAttributeChange} target={target} dataID={b.id} defaultValue={b.userid} users={users} domID="userForBill" changeFunction={handleUserChange} />
                    </td>
                    <td className="col-3 text-right">
                      <input type="number" name="amount"
                          defaultValue={b.amount}
                          onBlur={(e) => handleAmountChange(handleAttributeChange, b.id, e, target)}
                          className="text-right"/>
                    </td>
                    <td className="col-2">
                      <select className="form-control" id="categoriesForBill" defaultValue={b.categoryid} onChange={(e) => handleCategoryChange(handleAttributeChange, b.id, e, target)}>
                        {categories.map((c) => {
                          return (<option value={c.id} key={c.id}>{c.name}</option>);
                        })}
                      </select>
                    </td>
                    <td className="col-3 text-right">
                      <input type="text" name="date"
                          defaultValue={toFinnishDateString(b.date)}
                          onBlur={(e) => handleDateChange(handleAttributeChange, b.id, e, target)}
                          className="text-right"/>
                    </td>
                </tr>
              )) : null}
            </tbody>
          </table>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <button onClick={addBill} type="button" className="btn btn-primary">Lisää uusi lasku</button>
            <button onClick={createBills} type="button" className="btn btn-primary ml-1">Tallenna uudet laskut</button>
            <button onClick={updateBills} type="button" className="btn btn-primary ml-1">Päivitä vanhat laskut</button>
          </div>
          <div className="col-6">
            {successMessage
              ? <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              : null
             }
          </div>
        </div>
      </div>
    )
  }
}



const mapStateToProps = (state) => (
  {
    bills: state.billsData.bills,
    dataReceived: state.billsData.dataReceived,
    successMessage: state.billsData.successMessage,
    errorMessage: state.billsData.errorMessage,
    months: state.billsData.months,
    selectedMonth: state.billsData.selectedMonth,
    categories: state.categoriesData.categories,
    users: state.sharedData.users
  }
);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    changeMonth: (newMonth) => {
      dispatch(changeMonth(newMonth))
    },
    addBill: () => {
      dispatch(addBill())
    },
    createBills: () => (
      dispatch(createBills())
    ),
    updateBills: () => (
      dispatch(updateBills())
    ),
    handleAttributeChange: (attribute, id, value, target) => (
      dispatch(changeAttribute(attribute, id, value, target))
    )
  }
);

BillsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(BillsTable);

export default BillsTable;
