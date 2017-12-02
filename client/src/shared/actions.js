import fetch from 'isomorphic-fetch';
import {toProperCase} from './helpers';
import { serialize } from './helpers';

export function Interface(endpoint, httpVerb, successCall, failureCall, submitCall) {
  this.endpoint = endpoint;
  this.httpVerb = httpVerb;
  this.successCall = successCall;
  this.failureCall = failureCall;
  this.submitCall = submitCall;
  this.setHeaders = function (token, contentType) {
    let headersObj = {};
    if (token !== null) {
      headersObj.Authorization = `JWT ${token}`;
    }
    if (contentType !== null) {
      headersObj["Content-Type"] = contentType;
    }
    this.headers = new Headers(headersObj);
  };
  this.setBody = function(data, isJson) {
    if (!isJson) {
      this.body = serialize(data);
    } else {
      this.body = JSON.stringify(data);
    }
  };
  this.getDataForRequest = function() {
    let data = {};
    data.method = this.httpVerb;
    data.headers = this.headers;
    if (this.body !== null) {
      data.body = this.body;
    }
    return data;
  };
}

export function changeAttribute(attribute, id, newValue, target, isValid) {
  const objAttribute = "new" + toProperCase(attribute);
  return {
    type: 'CHANGE_' + target.toUpperCase() + "_" + attribute.toUpperCase(),
    id: id,
    [objAttribute]: newValue,
    isValid: isValid !== "undefined" ? isValid : true
  };
}

export function requestUsers() {
  return {
    type: 'REQUEST_USERS'
  };
}

export function receiveUsers(json) {
  return {
    type: 'RECEIVE_USERS',
    data: json.data
  };
}

export function getUsersInterface(token) {
  const usersInterface = new Interface('/users', 'GET', receiveUsers, null, requestUsers);
  usersInterface.setHeaders(token, null);
  return usersInterface;
}

export function fetchUsers() {
  return function (dispatch, getState) {
    if (getState().sharedData.usersDataReceived) {
      return;
    }
    const usersInterface = new Interface('/users', 'GET', receiveUsers, null, requestUsers);
    const token = getState().loginData.logInInfo.token;
    usersInterface.setHeaders(token, null);
    dispatch(callApi(usersInterface));
  };
}

export function callApi(interfaceObj) {
  return function (dispatch) {
    if (interfaceObj.submitCall !== null) {
      dispatch(interfaceObj.submitCall());
    }
    const request = new Request(interfaceObj.endpoint, interfaceObj.getDataForRequest());
    return fetch(request)
      .then(response => response.json()
        .then((json) => {
            if(!response.ok) {
              if (interfaceObj.failureCall !== null) {
                dispatch(interfaceObj.failureCall(json));
              }
            } else {
              dispatch(interfaceObj.successCall(json));
            }
        })
      ).catch(err => console.error(err));
  };
}
