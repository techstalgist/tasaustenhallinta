import fetch from 'isomorphic-fetch';

export function changeAttribute(attribute, id, newValue, target) {
  const objAttribute = "new" + attribute.charAt(0).toUpperCase() + attribute.substring(1);
  return {
    type: 'CHANGE_' + target.toUpperCase() + "_" + attribute.toUpperCase(),
    id: id,
    [objAttribute]: newValue
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

export function fetchUsers() {
  return function (dispatch, getState) {
    dispatch(requestUsers());
    const apiCallAddress = '/users';
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({ 'Authorization': `JWT ${token}` });
    const request = new Request(apiCallAddress, {
      method: 'GET',
      headers: headers
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveUsers(json))
      )
      .catch(err => console.error(err));
  };
}
