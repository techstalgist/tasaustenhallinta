import { callApi, Interface } from '../shared/actions';
import {validateArray} from '../shared/helpers';
import { getCategories } from './selectors';
import {shouldFetchBills} from '../bills/actions';


export function hideMessages() {
  return {
    type: 'HIDE_MESSAGES'
  };
}

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

export function addCategory() {
  return {
    type: 'NEW_CATEGORY'
  };
}

export function submitNewCategories() {
  return {
    type: 'SUBMIT_CATEGORIES'
  };
}

export function submitUpdate() {
  return {
    type: 'SUBMIT_CATEGORY_UPDATE'
  };
}

export function creationSuccess(json) {
  return {
    type: 'CATEGORY_CREATION_SUCCESS',
    message: json.message,
    data: json.data
  };
}

export function creationFailure(json) {
  return {
    type: 'CATEGORY_CREATION_FAILURE',
    message: json.message
  };
}

export function updateSuccess(json) {
  return {
    type: 'CATEGORY_UPDATE_SUCCESS',
    message: json.message
  };
}

export function updateFailure(json) {
  return {
    type: 'CATEGORY_UPDATE_FAILURE',
    message: json.message
  };
}

export function setCategoryToRemove(id) {
  return {
    type: 'SET_CATEGORY_TO_REMOVE',
    id: id
  };
}

export function deleteCategoryToRemove() {
  return {
    type: 'DELETE_CATEGORY_TO_REMOVE'
  };
}

export function closeDeletePopup() {
  return {
    type: 'CLOSE_DELETE_CATEGORY_POPUP'
  };
}

export function deleteCategoryFailure(json) {
  return {
    type: 'DELETE_CATEGORY_FAILURE',
    message: json.message
  };
}

export function shouldFetchCategories() {
  return {
    type: 'SHOULD_FETCH_CATEGORIES'
  };
}

export function submitDeleteCategory() {
  return function (dispatch, getState) {
    const toRemove = getState().categoriesData.toRemove;
    if (toRemove.removed) {
      return;
    }
    if (toRemove.newcategory) {
      dispatch(deleteCategoryToRemove());
    } else {
      const deleteInterface = new Interface('/categories/'+toRemove.id, 'DELETE', deleteCategoryToRemove, deleteCategoryFailure, null);
      const token = getState().loginData.logInInfo.token;
      deleteInterface.setHeaders(token, null);
      dispatch(callApi(deleteInterface));
      dispatch(shouldFetchBills());
    }
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

export function createOrUpdate(isCreate, httpVerb, success, failure, submit) {
  return function (dispatch, getState) {
    const allCategories = getState().categoriesData.categories;
    const neededCategories = getCategories(allCategories, isCreate);
    if (!validateArray(neededCategories)) {
      dispatch(failure({message: "Antamissasi tiedoissa on virheitä."}));
    } else {
      const categoriesInterface = new Interface('/categories', httpVerb, success, failure, submit);
      const token = getState().loginData.logInInfo.token;
      categoriesInterface.setHeaders(token, "application/json");
      categoriesInterface.setBody(neededCategories, true);
      dispatch(callApi(categoriesInterface));
    }
  };
}

export function createCategories() {
  return createOrUpdate(true, 'POST', creationSuccess, creationFailure, submitNewCategories);
}

export function updateCategories() {
  return createOrUpdate(false, 'PUT', updateSuccess, updateFailure, submitUpdate);
}
