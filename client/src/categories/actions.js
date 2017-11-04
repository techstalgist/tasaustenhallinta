import fetch from 'isomorphic-fetch';
import { serialize } from '../shared/helpers';

export function requestCategories() {
  return {
    type: 'REQUEST_CATEGORIES'
  };
}

export function receiveCategories(json) {
  return {
    type: 'RECEIVE_CATEGORIES',
    data: json.data
  };
}

export function receiveAnalysisData(json) {
  return {
    type: 'RECEIVE_ANALYSIS_DATA',
    data: json.data
  };
}

export function fetchAnalysisData() {
  return function (dispatch, getState) {
    const apiCallAddress = '/analysis';
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({
      'Authorization': `JWT ${token}`,
      'Content-Type': "application/x-www-form-urlencoded"
    });
    const body = serialize({users: [1, 2]});
    const request = new Request(apiCallAddress, {
      method: 'POST',
      headers: headers,
      body: body
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveAnalysisData(json))
      )
      .catch(err => console.error(err));
  };
}


export function fetchCategories() {
  return function (dispatch, getState) {
    dispatch(requestCategories());
    const apiCallAddress = '/categories';
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({ 'Authorization': `JWT ${token}` });
    const request = new Request(apiCallAddress, {
      method: 'GET',
      headers: headers
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveCategories(json))
      )
      .catch(err => console.error(err));
  };
}
