import React from 'react';
import {connect} from 'react-redux';
import { fetchBills, changeMonth, addBill, createBills, updateBills, setBillToRemove, closeDeletePopup, submitDeleteBill, hideMessages } from '../actions';
import { addAdjustment, fetchAdjustments } from '../../adjustments/actions';
import { getBillsForSelectedMonth } from '../selectors';
import { toFinnishDateString, getCssForDateField, getCssForNumberField, getCssForCategoryField } from '../../shared/helpers';
import { handleUserChange, handleAmountChange, handleDateChange, handleCategoryChange } from '../../shared/components/table/change-handlers';
import MonthSelection from './month-selection';
import AmountsForUsers from './amounts-for-users';
import TableHeaders from '../../shared/components/table/table-headers';
import UserDropdown from '../../shared/components/table/user-dropdown';
import DeletePopup from '../../shared/components/table/delete-popup';
import {changeAttribute } from '../../shared/actions';

class BillsTable extends React.Component {

  componentWillMount() {
    if (!this.props.dataReceived) {
      this.props.dispatch(fetchBills());
    }
    if (!this.props.adjustmentsDataReceived) {
      this.props.dispatch(fetchAdjustments());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(hideMessages());
  }

  handleMonthChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.changeMonth(e.target.value);
  }

  render() {
    const { addBill, createBills, updateBills, bills, users, months, selectedMonth, categories, handleAttributeChange,
            successMessage, errorMessage, handleRemoveButtonClick, closeDeletePopup, removeSuccess, toRemove,
            submitDeleteBill, showPopup, addAdjustment } = this.props;

    const billsForSelectedMonth = getBillsForSelectedMonth(bills, selectedMonth);
    const headersData = [
      {cssClass: "col-1", title: "#"},
      {cssClass: "col-2", title: "Käyttäjä"},
      {cssClass: "col-3 text-right", title: "Summa"},
      {cssClass: "col-2", title: "Kategoria"},
      {cssClass: "col-3 text-right", title: "Pvm"},
      {cssClass: "col text-center", title: ""}
    ];
    const target = "bill";
    return (
      <div>
        <div className="row">
          <div className="col-md-2 col-4">
            <MonthSelection months={months} selectedMonth={selectedMonth} handleMonthChange={this.handleMonthChange}/>
          </div>
          <div className="col-md-6 col-8">
            <AmountsForUsers bills={billsForSelectedMonth} users={users} addAdjustment={addAdjustment} />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-10 col">
            <table className="table table-sm border">
              <TableHeaders headers={headersData} rowClass="table-row"/>
              <tbody>
              {billsForSelectedMonth.length > 0 ? billsForSelectedMonth.map((b, i) =>
                (
                  <tr key={b.id} id={b.id} className="table-row">
                      <th className="col-1">
                        {i+1} {b.newbill ? <span className="badge badge-secondary small-font">Uusi</span> : null}
                        {b.changed ? <span className="badge badge-secondary small-font">Muutos</span> : null}
                      </th>
                      <td className="col-2">
                        <UserDropdown next={handleAttributeChange} target={target} dataID={b.id} value={b.userid} users={users} changeFunction={handleUserChange} />
                      </td>
                      <td className="col-3 text-right">
                        <input type="number" name="amount"
                            defaultValue={b.amount}
                            onBlur={(e) => handleAmountChange(handleAttributeChange, b.id, e, target)}
                            className={getCssForNumberField("text-right form-control p-1",b.amount)}/>
                      </td>
                      <td className="col-2">
                        <select className={getCssForCategoryField("form-control p-1", b.categoryid)} value={b.categoryid} onChange={(e) => handleCategoryChange(handleAttributeChange, b.id, e, target)}>
                          <option value={0} key={0}>--Ei valittu--</option>
                          {categories.map((c) => {
                            return (<option value={c.id} key={c.id}>{c.name}</option>);
                          })}
                        </select>
                      </td>
                      <td className="col-3 text-right">
                        <input type="text" name="date"
                            defaultValue={toFinnishDateString(b.date)}
                            onBlur={(e) => handleDateChange(handleAttributeChange, b.id, e, target)}
                            className={getCssForDateField("text-right form-control p-1",b.date)}/>
                      </td>
                      <td className="col text-center">
                        <button type="button" className="btn btn-outline-danger px-2 py-1" onClick={() => handleRemoveButtonClick(b.id)}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </td>
                  </tr>
                )) : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <button onClick={addBill} type="button" className="btn btn-primary ml-1 mb-1">Lisää uusi lasku</button>
            <button onClick={createBills} type="button" className="btn btn-primary ml-1 mb-1">Tallenna uudet laskut</button>
            <button onClick={updateBills} type="button" className="btn btn-primary ml-1 mb-1">Tallenna muutetut laskut</button>
          </div>
          <div className="col-6">
            {successMessage
              ? <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              : null
             }
             {errorMessage
               ? <div className="alert alert-danger" role="alert">
                   {errorMessage}
                 </div>
               : null
              }
          </div>
        </div>
        {showPopup ?
           <DeletePopup title="lasku" onSubmit={submitDeleteBill} objectToRemove={toRemove} success={removeSuccess} onPopupClose={closeDeletePopup} />
         : null}
      </div>
    )
  }
}



const mapStateToProps = (state) => (
  {
    bills: state.billsData.bills,
    dataReceived: state.billsData.dataReceived,
    adjustmentsDataReceived: state.adjustmentsData.dataReceived,
    successMessage: state.billsData.successMessage,
    errorMessage: state.billsData.errorMessage,
    months: state.billsData.months,
    selectedMonth: state.billsData.selectedMonth,
    toRemove: state.billsData.toRemove,
    removeSuccess: state.billsData.removeSuccess,
    showPopup: state.billsData.showPopup,
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
    handleAttributeChange: (attribute, id, value, target, isValid) => (
      dispatch(changeAttribute(attribute, id, value, target, isValid))
    ),
    handleRemoveButtonClick: (id) => {
      dispatch(setBillToRemove(id))
    },
    submitDeleteBill: () => (
      dispatch(submitDeleteBill())
    ),
    closeDeletePopup: () => (
      dispatch(closeDeletePopup())
    ),
    addAdjustment: (user, amount, date) => (
      dispatch(addAdjustment(user, amount, date))
    ),
  }
);

BillsTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(BillsTable);

export default BillsTable;
