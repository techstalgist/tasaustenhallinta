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

export function submitSignup(data) {
  const signUpInterface = new Interface('/signup', 'POST', logIn, failedSignup, null);
  signUpInterface.setHeaders(null, "application/x-www-form-urlencoded");
  signUpInterface.setBody(data, false);
  return callApi(signUpInterface);
}
