import fetch from 'isomorphic-fetch';
import { getAdjustments } from './selectors';
import { fetchUsers } from '../shared/actions';

export function requestAdjustments() {
  return {
    type: 'REQUEST'
  };
}

export function submitNewAdjustments() {
  return {
    type: 'SUBMIT'
  };
}

export function setAdjustmentToRemove(id) {
  return {
    type: 'SET_ADJUSTMENT_TO_REMOVE',
    id: id
  };
}

export function submitDeleteAdjustment() {
  return {
    type: 'SUBMIT_DELETE_ADJUSTMENT'
  };
}

export function closeDeletePopup() {
  return {
    type: 'CLOSE_DELETE_ADJUSTMENT_POPUP'
  };
}

export function submitUpdate() {
  return {
    type: 'SUBMIT_UPDATE'
  };
}

export function receiveAdjustments(json) {
  return {
    type: 'RECEIVE',
    data: json.data
  };
}

export function newAdjustment(user) {
  return {
    type: 'NEW_ADJUSTMENT',
    user: user
  };
}

export function addAdjustment() {
  return function (dispatch, getState) {
    const user = getState().loginData.logInInfo.user;
    dispatch(newAdjustment(user));
  };
}

export function creationSuccess(message, data) {
  return {
    type: 'CREATION_SUCCESS',
    message: message,
    data: data
  };
}

export function creationFailure(message) {
  return {
    type: 'CREATION_FAILURE',
    message: message
  };
}

export function updateSuccess(message) {
  return {
    type: 'UPDATE_SUCCESS',
    message: message
  };
}

export function updateFailure(message) {
  return {
    type: 'UPDATE_FAILURE',
    message: message
  };
}

export function fetchAdjustments() {
  return function (dispatch, getState) {
    dispatch(requestAdjustments());
    const apiCallAddress = '/adjustments';
    const token = getState().loginData.logInInfo.token;
    const mustFetchUsers = !getState().sharedData.usersDataReceived;
    const headers = new Headers({ 'Authorization': `JWT ${token}` });
    const request = new Request(apiCallAddress, {
      method: 'GET',
      headers: headers
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveAdjustments(json))
      ).then(() => {
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
    const apiCallAddress = '/adjustments';
    const allAdjustments = getState().adjustmentsData.adjustments;
    const neededAdjustments = getAdjustments(allAdjustments, newOnes);
    const data = JSON.stringify(neededAdjustments);
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

export function createAdjustments() {
  return callApiToCreateOrUpdate(submitNewAdjustments, true, 'POST', creationSuccess, creationFailure);
}

export function updateAdjustments() {
  return callApiToCreateOrUpdate(submitUpdate, false, 'PUT', updateSuccess, updateFailure);
}
