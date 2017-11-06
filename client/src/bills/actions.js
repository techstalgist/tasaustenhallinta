import fetch from 'isomorphic-fetch';
import {fetchCategories} from '../categories/actions';
import {getDefaultCategory} from '../categories/selectors';
import {fetchUsers} from '../shared/actions';

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
