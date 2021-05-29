import { Interface, callApi } from '../shared/actions';

export function resetSuccess(json) {
  return {
    type: 'RESET_SUCCESS',
    message: json.message
  };
}

export function addToken(token) {
  return {
    type: 'ADD_TOKEN',
    token: token
  }
}

export function resetFailure(json) {
  return {
    type: 'RESET_FAILURE',
    message: json.message
  };
}

export function submitResetPassword(data) {
  return function (dispatch, getState) {
    const token = getState().resetPasswordData.token;
    if (!token) {
      console.log("No token defined");
      return;
    }
    const resetPassInterface = new Interface('/reset-password/' + token, 'PATCH', resetSuccess, resetFailure, null);
    resetPassInterface.setHeaders(null, "application/x-www-form-urlencoded");
    resetPassInterface.setBody(data, false);
    dispatch(callApi(resetPassInterface));
  }
}
