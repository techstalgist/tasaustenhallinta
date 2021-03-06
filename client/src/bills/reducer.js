import { v4 } from 'node-uuid';
import { getCurrentMonth, getMonths, getMonth, createMonthFromDate } from './months';
import {toFinnishDateString, isValidISODate, isValidAmount, isValidCategory} from '../shared/helpers';
import {updateArrayWithUpdateFunction, changeOneItemInArray, removeItemFromArray} from '../shared/reducer-helpers';

function getInitialState() {
  return {
    bills: {},
    dataReceived: false,
    successMessage: null,
    errorMessage: null,
    selectedMonth: getCurrentMonth(),
    months: getMonths(new Date()),
    toRemove: {},
    showPopup: false,
    removeSuccess: false
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'CLEAN_BILLS_STATE':
      return getInitialState();
    case 'HIDE_MESSAGES':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'SHOULD_FETCH_BILLS':
      return {
        ...state,
        dataReceived: false
      }
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
    case 'SUBMIT_BILLS':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      };
    case 'SUBMIT_BILLS_UPDATE':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      };
    case 'CHANGE_MONTH':
      const monthInState = getMonth(action.monthString, state.months);
      return {
        ...state,
        selectedMonth: monthInState,
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_BILL_USER':
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        bills: updateBillReducer(state.bills, state.selectedMonth, action.id, setUser, action.newUser)
      }
    case 'CHANGE_BILL_AMOUNT':
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        bills: updateBillReducer(state.bills, state.selectedMonth, action.id, setAmount, action.newAmount)
      }
    case 'CHANGE_BILL_CATEGORY':
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
        bills: updateBillReducer(state.bills, state.selectedMonth, action.id, setCategory, action.newCategory)
      }
    case 'CHANGE_BILL_DATE':
      let shouldChangeMonth;
      let newDateObj
      if (!action.isValid) {
        shouldChangeMonth = false;
      } else {
        newDateObj = new Date(action.newDate);
        shouldChangeMonth = (newDateObj.getFullYear() !== state.selectedMonth.year) || ((newDateObj.getMonth()+1) !== state.selectedMonth.month);
      }
      if (!shouldChangeMonth) {
        return {
          ...state,
          successMessage: null,
          errorMessage: null,
          bills: updateBillReducer(state.bills, state.selectedMonth, action.id, setDate, action.newDate)
        }
      } else {
          return {
            ...state,
            successMessage: null,
            errorMessage: null,
            bills: dateAndMonthChangeReducer(state.bills, state.selectedMonth.toString(), action.id, newDateObj)
          }
      }
    case 'NEW_BILL':
      const newBill = createNewBill(action.user, action.category, state.selectedMonth.getAsDate());
      return {
        ...state,
        bills: newBillReducer(state.bills, state.selectedMonth.toString(), newBill),
        successMessage: null,
        errorMessage: null
      }
    case 'BILL_CREATION_SUCCESS':
      if (action.data === null) {
        return {
          ...state,
          successMessage: action.message
        }
      }
      return {
          ...state,
          successMessage: action.message,
          bills: billsDataReducer(action.data, handleBillFromBackend)
      }
    case 'BILL_CREATION_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'BILL_UPDATE_SUCCESS':
      return {
        ...state,
        bills: billsDataReducer(state.bills, updateChanged),
        successMessage: action.message,
        errorMessage: null
      }
    case 'BILL_UPDATE_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'DELETE_BILL_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'SET_BILL_TO_REMOVE':
      return {
        ...state,
        toRemove: findBillToRemove(state.bills, state.selectedMonth.toString(), action.id),
        showPopup: true,
        successMessage: null,
        errorMessage: null
      }
    case 'CLOSE_DELETE_BILL_POPUP':
      return {
        ...state,
        toRemove: {},
        showPopup: false,
        removeSuccess: false
      }
    case 'DELETE_BILL_TO_REMOVE':
      return {
        ...state,
        bills: deleteBillReducer(state.bills, state.selectedMonth.toString(), state.toRemove.id),
        toRemove: {
          ...state.toRemove,
          removed: true
        },
        removeSuccess: true
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
      [Object.keys(newData)[i]]: updateArrayWithUpdateFunction(newData[Object.keys(newData)[i]], updateFunction)
    }
  }
  return updated;
}

function handleBillFromBackend(b) {
  return {
    ...b,
    id: b.id.toString(),
    newbill: false,
    toUIObject: billToUIObject(),
    isValid: function() {
      return isValidISODate(this.date) && isValidAmount(this.amount) && isValidCategory(this.categoryid);
    },
    categoryid: b.categoryid || 0,
    changed: false
  }
}

function deleteBillReducer(bills, monthStr, billId) {
  return {
    ...bills,
    [monthStr]: removeItemFromArray(bills[monthStr], billId)
  }
}

function findBillToRemove(bills, monthStr, billId) {
  return bills[monthStr].filter((b) => b.id === billId)[0];
}

function dateAndMonthChangeReducer(bills, oldMonthStr, billId, newDateObj) {
  const newMonthStr = createMonthFromDate(newDateObj).toString();
  const bill = bills[oldMonthStr].filter((b) => b.id === billId)[0];
  // TODO fix for "if newDateObj is invalid"
  const updatedBill = setDate(bill, newDateObj.toISOString().substr(0,10));
  return {
    ...bills,
    [oldMonthStr]: removeItemFromArray(bills[oldMonthStr], billId),
    [newMonthStr]: newBillToMonthReducer(bills[newMonthStr], updatedBill)
  }
}

function newBillReducer(currentBills, monthStr, newBill) {
  return {
    ...currentBills,
    [monthStr]: newBillToMonthReducer(currentBills[monthStr], newBill)
  }
}

function newBillToMonthReducer(currentBillsForMonth, newBill) {
  if (currentBillsForMonth === undefined) {
    currentBillsForMonth = [];
  }
  return [
    ...currentBillsForMonth,
    newBill
  ]
}

function createNewBill(user, category, date) {
  return {
    id: v4(),
    userid: user.id,
    username: user.username,
    amount: null,
    categoryname: category.name,
    categoryid: category.id,
    date: date.toISOString().substr(0,10),
    newbill: true,
    changed: false,
    toUIObject: billToUIObject(),
    isValid: function() {
      return isValidISODate(this.date) && isValidAmount(this.amount) && isValidCategory(this.categoryid);
    }
  }
}

function updateBillReducer(currentBills, selectedMonth, id, updateFunction, newValue) {
  return {
    ...currentBills,
    [selectedMonth.toString()]: changeOneItemInArray(currentBills[selectedMonth.toString()], id, updateFunction, newValue)
  }
}

function setUser(bill, newUser) {
  if (newUser.id === bill.userid) {
    return {...bill};
  }
  return {
    ...bill,
    userid: newUser.id,
    username: newUser.username,
    changed: !bill.newbill
  }
}

function setCategory(bill, newCategory) {
  if (newCategory.id === bill.categoryid) {
    return {...bill};
  }
  return {
    ...bill,
    categoryid: newCategory.id,
    categoryname: newCategory.name,
    changed: !bill.newbill
  }
}

function setDate(bill, newDate) {
  if (newDate === bill.date) {
    return {...bill};
  }
  return {
    ...bill,
    date: newDate,
    changed: !bill.newbill
  }
}

function setAmount(bill, newAmount) {
  if (newAmount === bill.amount) {
    return {...bill};
  }
  return {
    ...bill,
    amount: newAmount,
    changed: !bill.newbill
  }
}

function updateChanged(b) {
  return {
    ...b,
    changed: false
  }
}

function billToUIObject() {
  return function() {
    return {
      "Käyttäjä": this.username,
      "Määrä": this.amount || 0,
      "Kategoria": this.categoryname,
      "Pvm": toFinnishDateString(this.date)
    }
  }
}
