import { logIn } from '../login/actions';
import { Interface, callApi } from '../shared/actions';

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

export function groupLogIn(json) {
  return {
    type: 'GROUP_LOGIN',
    message: json.message,
    userGroup: json.userGroup
  };
}

export function failedGroupLogin(json) {
  return {
    type: 'FAILED_GROUP_LOGIN',
    message: json.message
  };
}

export function submitGroupLogin(data) {
  const loginInterface = new Interface('/user_groups/login', 'POST', groupLogIn, failedGroupLogin, null);
  loginInterface.setHeaders(null, "application/x-www-form-urlencoded");
  loginInterface.setBody(data, false);
  return callApi(loginInterface);
}

export function submitSignup(data) {
  return function (dispatch, getState) {
    const dataWithGroup = {
      ...data,
      user_group_id: getState().signUpData.userGroup.id
    }
    const signUpInterface = new Interface('/signup', 'POST', logIn, failedSignup, null);
    signUpInterface.setHeaders(null, "application/x-www-form-urlencoded");
    signUpInterface.setBody(dataWithGroup, false);
    dispatch(callApi(signUpInterface));
  };
}

export function submitGroupSignup(data) {
  const signUpInterface = new Interface('/user_groups/signup', 'POST', groupLogIn, failedSignup, null);
  signUpInterface.setHeaders(null, "application/x-www-form-urlencoded");
  signUpInterface.setBody(data, false);
  return callApi(signUpInterface);
}
