import { Interface, callApi } from '../shared/actions';

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

export function hideLoginSuccess() {
  return {
    type: 'HIDE_LOGIN_SUCCESS'
  };
}

export function submitLogin(data) {
  const loginInterface = new Interface('/login', 'POST', logIn, failedLogin, null);
  loginInterface.setHeaders(null, "application/x-www-form-urlencoded");
  loginInterface.setBody(data, false);
  return callApi(loginInterface);
}

export function submitLogout() {
  // apparently no real need to invalidate tokens on server side.
  return function (dispatch) {
    dispatch(logOut());
  };
}
