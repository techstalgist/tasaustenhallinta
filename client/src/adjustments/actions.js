import { getAdjustments } from './selectors';
import { fetchUsers, callApi, Interface } from '../shared/actions';
import {validateArray} from '../shared/helpers';

export function hideMessages() {
  return {
    type: 'HIDE_MESSAGES'
  };
}

export function requestAdjustments() {
  return {
    type: 'REQUEST'
  };
}

export function submitNewAdjustments() {
  return {
    type: 'SUBMIT'
  };
}

export function setAdjustmentToRemove(id) {
  return {
    type: 'SET_ADJUSTMENT_TO_REMOVE',
    id: id
  };
}

export function deleteAdjustmentToRemove() {
  return {
    type: 'DELETE_ADJUSTMENT_TO_REMOVE'
  };
}


export function submitDeleteAdjustment() {
  return function (dispatch, getState) {
    const toRemove = getState().adjustmentsData.toRemove;
    if (toRemove.removed) {
      return;
    }
    if (toRemove.newadjustment) {
      dispatch(deleteAdjustmentToRemove());
    } else {
      const deleteAdjustmentInterface = new Interface('/adjustments/'+toRemove.id, 'DELETE', deleteAdjustmentToRemove, deleteFailure, null);
      const token = getState().loginData.logInInfo.token;
      deleteAdjustmentInterface.setHeaders(token, null);
      dispatch(callApi(deleteAdjustmentInterface));
    }
  };
}

export function closeDeletePopup() {
  return {
    type: 'CLOSE_DELETE_ADJUSTMENT_POPUP'
  };
}

export function submitUpdate() {
  return {
    type: 'SUBMIT_UPDATE'
  };
}

export function receiveAdjustments(json) {
  return {
    type: 'RECEIVE',
    data: json.data
  };
}

export function newAdjustment(user, amount) {
  return {
    type: 'NEW_ADJUSTMENT',
    user: user,
    amount: amount
  };
}

export function addAdjustment(user, amount) {
  return function (dispatch, getState) {
    const userFromState = getState().loginData.logInInfo.user;
    dispatch(newAdjustment(user || userFromState, amount));
  };
}

export function creationSuccess(json) {
  return {
    type: 'CREATION_SUCCESS',
    message: json.message,
    data: json.data
  };
}

export function creationFailure(json) {
  return {
    type: 'CREATION_FAILURE',
    message: json.message
  };
}

export function deleteFailure(message) {
  return {
    type: 'DELETE_FAILURE',
    message: message
  };
}

export function updateSuccess(json) {
  return {
    type: 'UPDATE_SUCCESS',
    message: json.message
  };
}

export function updateFailure(json) {
  return {
    type: 'UPDATE_FAILURE',
    message: json.message
  };
}

export function fetchAdjustments() {
  return function (dispatch, getState) {
    const fetchAdjustmentsInterface = new Interface('/adjustments', 'GET', receiveAdjustments, null, requestAdjustments);
    const token = getState().loginData.logInInfo.token;
    fetchAdjustmentsInterface.setHeaders(token, null);
    Promise.all([dispatch(callApi(fetchAdjustmentsInterface))]).then(() => {
      dispatch(fetchUsers());
    });
  };
}

export function createOrUpdate(isCreate, httpVerb, success, failure, submit) {
  return function (dispatch, getState) {
    const allAdjustments = getState().adjustmentsData.adjustments;
    const neededAdjustments = getAdjustments(allAdjustments, isCreate);
    if (!validateArray(neededAdjustments)) {
      dispatch(failure({message: "Antamissasi tiedoissa on virheitä."}));
    } else {
      const adjustmentsInterface = new Interface('/adjustments', httpVerb, success, failure, submit);
      const token = getState().loginData.logInInfo.token;
      adjustmentsInterface.setHeaders(token, "application/json");
      adjustmentsInterface.setBody(neededAdjustments, true);
      dispatch(callApi(adjustmentsInterface));
    }
  };
}

export function createAdjustments() {
  return createOrUpdate(true, 'POST', creationSuccess, creationFailure, submitNewAdjustments);
}

export function updateAdjustments() {
  return createOrUpdate(false, 'PUT', updateSuccess, updateFailure, submitUpdate);
}
