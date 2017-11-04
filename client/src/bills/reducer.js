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
      bills: {
        ...state.bills,
        [action.monthYear]: billsDataReducer(action.data, handleBillFromBackend)
      }
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
  let i;
  let updated = newData;
  for(i = 0; i < newData.length; i++) {
    updated = [
      ...updated.slice(0, i),
      updateFunction(updated[i]),
      ...updated.slice(i+1),
    ]
  }
  return updated;
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
