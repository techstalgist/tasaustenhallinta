import {fetchCategories} from '../categories/actions';
import {getDefaultCategory} from '../categories/selectors';
import {fetchUsers, Interface, callApi} from '../shared/actions';
import {getBills} from './selectors';

export function submitNewBills() {
  return {
    type: 'SUBMIT_BILLS'
  };
}

export function submitBillsUpdate() {
  return {
    type: 'SUBMIT_BILLS_UPDATE'
  };
}


export function requestBills() {
  return {
    type: 'REQUEST_BILLS'
  };
}

export function receiveBills(json) {
  return {
    type: 'RECEIVE_BILLS',
    data: json.data
  };
}

export function changeMonth(newMonth) {
  return {
    type: 'CHANGE_MONTH',
    monthString: newMonth
  };
}

export function newBill(user, category) {
  return {
    type: 'NEW_BILL',
    user: user,
    category: category
  };
}

export function creationSuccess(json) {
  return {
    type: 'BILL_CREATION_SUCCESS',
    message: json.message,
    data: json.data
  };
}

export function creationFailure(json) {
  return {
    type: 'BILL_CREATION_FAILURE',
    message: json.message
  };
}

export function updateSuccess(json) {
  return {
    type: 'BILL_UPDATE_SUCCESS',
    message: json.message
  };
}

export function updateFailure(json) {
  return {
    type: 'BILL_UPDATE_FAILURE',
    message: json.message
  };
}

export function deleteBillFailure(json) {
  return {
    type: 'DELETE_BILL_FAILURE',
    message: json.message
  };
}

export function setBillToRemove(id) {
  return {
    type: 'SET_BILL_TO_REMOVE',
    id: id
  };
}

export function deleteBillToRemove() {
  return {
    type: 'DELETE_BILL_TO_REMOVE'
  };
}

export function closeDeletePopup() {
  return {
    type: 'CLOSE_DELETE_BILL_POPUP'
  };
}

export function addBill() {
  return function (dispatch, getState) {
    const user = getState().loginData.logInInfo.user;
    const defaultCategory = getDefaultCategory(getState().categoriesData.categories);
    dispatch(newBill(user, defaultCategory));
  };
}

export function fetchBills() {
  return function (dispatch, getState) {
    const fetchInterface = new Interface('/bills', 'GET', receiveBills, null, requestBills);
    const token = getState().loginData.logInInfo.token;
    fetchInterface.setHeaders(token, null);
    dispatch(callApi(fetchInterface));
    dispatch(fetchCategories()); // TODO same as below
    dispatch(fetchUsers()); // TODO these dispatches are now run in async manner. second one doesn't wait for the completion of 1st one.
  };
}

export function createOrUpdate(isCreate, httpVerb, success, failure, submit) {
  return function (dispatch, getState) {
    const allBills = getState().billsData.bills;
    const neededBills = getBills(allBills, isCreate);
    if (!neededBills.allValid) {
      dispatch(failure({message: neededBills.message}));
    } else {
      const billsInterface = new Interface('/bills', httpVerb, success, failure, submit);
      const token = getState().loginData.logInInfo.token;
      billsInterface.setHeaders(token, "application/json");
      billsInterface.setBody(neededBills.bills, true);
      dispatch(callApi(billsInterface));
    }
  };
}

export function createBills() {
  return createOrUpdate(true, 'POST', creationSuccess, creationFailure, submitNewBills);
}

export function updateBills() {
  return createOrUpdate(false, 'PUT', updateSuccess, updateFailure, submitBillsUpdate);
}

export function submitDeleteBill() {
  return function (dispatch, getState) {
    const toRemove = getState().billsData.toRemove;
    if (toRemove.removed) {
      return;
    }
    if (toRemove.newbill) {
      dispatch(deleteBillToRemove());
    } else {
      const deleteInterface = new Interface('/bills/'+toRemove.id, 'DELETE', deleteBillToRemove, deleteBillFailure, null);
      const token = getState().loginData.logInInfo.token;
      deleteInterface.setHeaders(token, null);
      dispatch(callApi(deleteInterface));
    }
  };
}
