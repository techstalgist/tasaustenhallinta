//import { v4 } from 'node-uuid';
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
        [action.monthYear]: action.data
      }
    }
    case 'CHANGE_MONTH':
      const monthInState = getMonth(action.monthString, state.months);
      return {
        ...state,
        selectedMonth: monthInState
      }
    default:
      return state;
  }
}
