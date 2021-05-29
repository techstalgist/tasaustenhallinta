import { Interface, callApi } from '../shared/actions';

export function forgotSuccess(json) {
  return {
    type: 'FORGOT_SUCCESS',
    message: json.message
  };
}

export function forgotFailure(json) {
  return {
    type: 'FORGOT_FAILURE',
    message: json.message
  };
}

export function submitForgotPassword(data) {
  const forgotPassInterface = new Interface('/forgot-password', 'PATCH', forgotSuccess, forgotFailure, null);
  forgotPassInterface.setHeaders(null, "application/x-www-form-urlencoded");
  forgotPassInterface.setBody(data, false);
  return callApi(forgotPassInterface);
}
