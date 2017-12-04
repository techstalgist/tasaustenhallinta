import { Interface, callApi } from '../shared/actions';

export function logIn(json) {
  return {
    type: 'LOGIN',
    message: json.message,
    user: json.user,
    token: json.token
  };
}

export function cleanAdjustmentsState() {
  return {
    type: 'CLEAN_ADJUSTMENTS_STATE'
  };
}

export function cleanBillsState() {
  return {
    type: 'CLEAN_BILLS_STATE'
  };
}

export function cleanCategoriesState() {
  return {
    type: 'CLEAN_CATEGORIES_STATE'
  };
}

export function cleanSharedState() {
  return {
    type: 'CLEAN_SHARED_STATE'
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
  const loginInterface = new Interface('/login', 'POST', logIn, failedLogin, null);
  loginInterface.setHeaders(null, "application/x-www-form-urlencoded");
  loginInterface.setBody(data, false);
  return callApi(loginInterface);
}

export function submitLogout() {
  // apparently no real need to invalidate tokens on server side.
  return function (dispatch) {
    dispatch(logOut());
    dispatch(cleanAdjustmentsState());
    dispatch(cleanBillsState());
    dispatch(cleanCategoriesState());
    dispatch(cleanSharedState());
  };
}
