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
    case 'CHANGE_BILL_USER':
      return {
        ...state,
        bills: updateBillReducer(state.bills, state.selectedMonth, action.id, setUser, action.newUser)
      }
    case 'NEW_BILL':
      return {
        ...state,
        bills: newBillReducer(state.bills, state.selectedMonth, action.user, action.category)
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

function newBillReducer(currentBills, selectedMonth, user, category) {
  return {
    ...currentBills,
    [selectedMonth.toString()]: newBillToMonthReducer(currentBills[selectedMonth.toString()], user, category)
  }
}

function newBillToMonthReducer(currentBillsForMonth, user, category) {
  if (currentBillsForMonth === undefined) {
    currentBillsForMonth = [];
  }
  return [
    ...currentBillsForMonth,
    {
      id: v4(),
      userid: user.id,
      username: user.username,
      amount: null,
      categoryname: category.name,
      categoryid: category.id,
      date: new Date().toISOString().substr(0,10),
      newbill: true
    }
  ]
}

function updateBillReducer(currentBills, selectedMonth, id, updateFunction, newValue) {
  return {
    ...currentBills,
    [selectedMonth.toString()]: updateBillInMonth(currentBills[selectedMonth.toString()], updateFunction, id, newValue)
  }
}

function updateBillInMonth(bills, updateFunction, id, newValue) {
  let updatedBillsForMonth = bills;
  const index = getBillIndexById(id, updatedBillsForMonth);
  updatedBillsForMonth = [
    ...updatedBillsForMonth.slice(0, index),
    updateFunction(updatedBillsForMonth[index], newValue),
    ...updatedBillsForMonth.slice(index+1),
  ]
  return updatedBillsForMonth;
}

function getBillIndexById(id, bills) {
  const ids = bills.map( (b) => b.id );
  return ids.indexOf(id);
}

function setUser(bill, newUser) {
  return {
    ...bill,
    userid: newUser.id,
    username: newUser.username
  }
}
