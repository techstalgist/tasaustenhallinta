import fetch from 'isomorphic-fetch';
import { serialize } from '../shared/helpers';
import { logIn } from '../login/actions';

export function failedSignup(json) {
  return {
    type: 'FAILED_SIGNUP',
    message: json.message
  };
}

export function hideSignUpMessages() {
  return {
    type: 'HIDE_MESSAGES'
  };
}

export function submitSignup(data) {
  return function (dispatch) {
    const apiCallAddress = '/signup';
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
              dispatch(failedSignup(json));
            } else {
              dispatch(logIn(json));
            }
        })
      ).catch(err => console.error(err));
  };
}
