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

export function submitResetPassword(data) {
  const forgotPassInterface = new Interface('/reset-password', 'PATCH', forgotSuccess, forgotFailure, null);
  forgotPassInterface.setHeaders(null, "application/x-www-form-urlencoded");
  forgotPassInterface.setBody(data, false);
  return callApi(forgotPassInterface);
}
