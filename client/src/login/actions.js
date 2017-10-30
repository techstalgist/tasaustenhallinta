import fetch from 'isomorphic-fetch';
import { serialize } from '../shared/helpers';

export function logIn(json) {
  return {
    type: 'LOGIN',
    message: json.message,
    user: json.user,
    token: json.token
  };
}

export function failedLogin(json) {
  return {
    type: 'FAILED_LOGIN',
    message: json.message
  };
}

export function logOut(json) {
  return {
    type: 'LOGOUT'
  };
}

export function submitLogin(data) {
  return function (dispatch) {
    const apiCallAddress = '/login';
    const reqBody = serialize(data);
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    const request = new Request(apiCallAddress, {
      method: 'POST',
      headers: headers,
      body: reqBody
    });
    return fetch(request)
      .then(response => response.json()
        .then((json) => {
            if(!response.ok) {
              dispatch(failedLogin(json));
            } else {
              dispatch(logIn(json));
            }
        })
      ).catch(err => console.error(err));
  };
}

export function submitLogout() {
  // apparently no real need to invalidate tokens on server side.
  return function (dispatch) {
    dispatch(logOut());
  };
}
