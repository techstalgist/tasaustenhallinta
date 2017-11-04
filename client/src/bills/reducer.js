import { v4 } from 'node-uuid';
import { getCurrentMonth, getMonths, getMonth } from './months';

function getInitialState() {
  return {
    bills: {},
    dataReceived: false,
    successMessage: null,
    errorMessage: null,
    selectedMonth: getCurrentMonth(),
    months: getMonths(new Date())
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'REQUEST_BILLS':
      return {
        ...state,
        dataReceived: false
      };
    case 'RECEIVE_BILLS':
    return {
      ...state,
      dataReceived: true,
      bills: billsDataReducer(action.data, handleBillFromBackend)
    }
    case 'CHANGE_MONTH':
      const monthInState = getMonth(action.monthString, state.months);
      return {
        ...state,
        selectedMonth: monthInState
      }
    case 'NEW_BILL':
      return {
        ...state,
        bills: newBillReducer(state.bills, state.selectedMonth, action.user)
      }
    default:
      return state;
  }
}

function billsDataReducer(newData, updateFunction) {
  let updated = newData;
  for(let i = 0; i < Object.keys(newData).length; i++) {
    updated = {
      ...updated,
      [Object.keys(newData)[i]]: handleOneMonth(newData[Object.keys(newData)[i]], updateFunction)
    }
  }
  return updated;
}

function handleOneMonth(bills, updateFunction) {
  let updatedBillsForMonth = bills;
  for(let i = 0; i < bills.length; i++) {
    updatedBillsForMonth = [
      ...updatedBillsForMonth.slice(0, i),
      updateFunction(updatedBillsForMonth[i]),
      ...updatedBillsForMonth.slice(i+1),
    ]
  }
  return updatedBillsForMonth;
}

function handleBillFromBackend(b) {
  return {
    ...b,
    id: b.id.toString(),
    newbill: false
  }
}


function newBillReducer(currentBills, selectedMonth, user) {
  return {
    ...currentBills,
    [selectedMonth.toString()]: newBillToMonthReducer(currentBills[selectedMonth.toString()], user)
  }
}

function newBillToMonthReducer(currentBillsForMonth,user) {
  return [
    ...currentBillsForMonth,
    {
      id: v4(),
      userid: user.id,
      username: user.username,
      amount: null,
      categoryname: null,
      categoryid: null,
      date: new Date().toISOString().substr(0,10),
      newbill: true
    }
  ]
}
