import { callApi, Interface } from '../shared/actions';

export function requestCategories() {
  return {
    type: 'REQUEST_CATEGORIES'
  };
}

export function receiveCategories(json) {
  return {
    type: 'RECEIVE_CATEGORIES',
    data: json.data
  };
}

export function receiveAnalysisData(json) {
  return {
    type: 'RECEIVE_ANALYSIS_DATA',
    data: json.data
  };
}

export function fetchAnalysisData() {
  return function (dispatch, getState) {
    const analysisInterface = new Interface('/analysis', 'POST', receiveAnalysisData, null, null);
    const token = getState().loginData.logInInfo.token;
    const data = {users: [1, 2]}; // TODO
    analysisInterface.setHeaders(token, "application/x-www-form-urlencoded");
    analysisInterface.setBody(data, false);
    dispatch(callApi(analysisInterface));
  };
}

export function fetchCategories() {
  return function (dispatch, getState) {
    if (getState().categoriesData.dataReceived) {
      return;
    }
    const fetchCategoriesInterface = new Interface('/categories', 'GET', receiveCategories, null, requestCategories);
    const token = getState().loginData.logInInfo.token;
    fetchCategoriesInterface.setHeaders(token, null);
    dispatch(callApi(fetchCategoriesInterface));
  };
}
