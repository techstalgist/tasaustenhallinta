import fetch from 'isomorphic-fetch';

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
