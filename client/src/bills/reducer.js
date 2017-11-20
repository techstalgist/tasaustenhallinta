import { v4 } from 'node-uuid';
import { getCurrentMonth, getMonths, getMonth, createMonthFromDate } from './months';
import {toFinnishDateString} from '../shared/helpers';

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
      const newDateObj = new Date(action.newDate);
      const monthUnchanged = (newDateObj.getFullYear() === state.selectedMonth.year) && ((newDateObj.getMonth()+1) === state.selectedMonth.month);
      if (monthUnchanged) {
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
      const newBill = createNewBill(action.user, action.category);
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
        errorMessage: action.message
      }
    case 'BILL_UPDATE_SUCCESS':
      return {
        ...state,
        successMessage: action.message
      }
    case 'BILL_UPDATE_FAILURE':
      return {
        ...state,
        errorMessage: action.message
      }
    case 'DELETE_BILL_FAILURE':
      return {
        ...state,
        errorMessage: action.message
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
    newbill: false,
    toUIObject: billToUIObject()
  }
}

function deleteBillReducer(bills, monthStr, billId) {
  return {
    ...bills,
    [monthStr]: deleteBillInMonth(bills[monthStr], billId)
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
    [oldMonthStr]: deleteBillInMonth(bills[oldMonthStr], billId),
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

function createNewBill(user, category) {
  return {
    id: v4(),
    userid: user.id,
    username: user.username,
    amount: null,
    categoryname: category.name,
    categoryid: category.id,
    date: new Date().toISOString().substr(0,10),
    newbill: true,
    toUIObject: billToUIObject()
  }
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

function deleteBillInMonth(bills, id) {
  let billsToReturn = bills;
  const index = getBillIndexById(id, billsToReturn);
  billsToReturn = [
    ...billsToReturn.slice(0, index),
    ...billsToReturn.slice(index+1)
  ]
  return billsToReturn;
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

function setCategory(bill, newCategory) {
  return {
    ...bill,
    categoryid: newCategory.id,
    categoryname: newCategory.name
  }
}

function setDate(bill, newDate) {
  return {
    ...bill,
    date: newDate
  }
}

function setAmount(bill, newAmount) {
  return {
    ...bill,
    amount: newAmount
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
