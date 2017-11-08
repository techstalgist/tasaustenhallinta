import fetch from 'isomorphic-fetch';
import {fetchCategories} from '../categories/actions';
import {getDefaultCategory} from '../categories/selectors';
import {fetchUsers} from '../shared/actions';
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

export function creationSuccess(message, data) {
  return {
    type: 'BILL_CREATION_SUCCESS',
    message: message,
    data: data
  };
}

export function creationFailure(message) {
  return {
    type: 'BILL_CREATION_FAILURE',
    message: message
  };
}

export function updateSuccess(message) {
  return {
    type: 'BILL_UPDATE_SUCCESS',
    message: message
  };
}

export function updateFailure(message) {
  return {
    type: 'BILL_UPDATE_FAILURE',
    message: message
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
    dispatch(requestBills());
    const apiCallAddress = '/bills';
    const mustFetchCategories = !getState().categoriesData.dataReceived;
    const mustFetchUsers = !getState().sharedData.usersDataReceived;
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({ 'Authorization': `JWT ${token}` });
    const request = new Request(apiCallAddress, {
      method: 'GET',
      headers: headers
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveBills(json))
      ).then(() => {
        if (mustFetchCategories) {
          dispatch(fetchCategories());
        }
      }).then(() => {
        if (mustFetchUsers) {
          dispatch(fetchUsers());
        }
      })
      .catch(err => console.error(err));
  };
}


export function callApiToCreateOrUpdate(submitCall, newOnes, httpVerb, successCall, failureCall) {
  return function (dispatch, getState) {
    dispatch(submitCall());
    const apiCallAddress = '/bills';
    const allBills = getState().billsData.bills;
    const neededBills = getBills(allBills, newOnes);
    const data = JSON.stringify(neededBills);
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": `JWT ${token}`
    });
    const request = new Request(apiCallAddress, {
      method: httpVerb,
      headers: headers,
      body: data
    });
    return fetch(request)
      .then(response => response.json()
        .then((json) => {
            if(!response.ok) {
              dispatch(failureCall(json.message));
            } else {
              if (newOnes) {
                dispatch(successCall(json.message, json.data));
              } else {
                dispatch(successCall(json.message));
              }
            }
        })
      ).catch(err => console.error(err));
  };
}

export function createBills() {
  return callApiToCreateOrUpdate(submitNewBills, true, 'POST', creationSuccess, creationFailure);
}

export function updateBills() {
  return callApiToCreateOrUpdate(submitBillsUpdate, false, 'PUT', updateSuccess, updateFailure);
}
