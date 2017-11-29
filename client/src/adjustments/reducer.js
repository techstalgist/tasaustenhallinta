import { v4 } from 'node-uuid';
import {toFinnishDateString, isValidISODate, isValidAmount, getIndexById} from '../shared/helpers';

function getInitialState() {
  return {
    adjustments: [],
    dataReceived: false,
    successMessage: null,
    errorMessage: null,
    toRemove: {},
    showPopup: false,
    removeSuccess: false
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'HIDE_MESSAGES':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'REQUEST':
      return {
        ...state,
        dataReceived: false
      };
    case 'SUBMIT':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'SUBMIT_UPDATE':
       return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'RECEIVE':
      return {
        ...state,
        adjustments: adjustmentsDataReducer(action.data, updateDateAndId),
        dataReceived: true,
        successMessage: null,
        errorMessage: null
      };
    case 'NEW_ADJUSTMENT':
      return {
        ...state,
        adjustments: newAdjustmentReducer(state.adjustments, action.user),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_AMOUNT':
      return {
        ...state,
        adjustments: changeOneAdjustment(state.adjustments, action.id, setAmount, action.newAmount),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_DATE':
      return {
        ...state,
        adjustments: changeOneAdjustment(state.adjustments, action.id, setDate, action.newDate),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_USER':
      return {
        ...state,
        adjustments: changeOneAdjustment(state.adjustments, action.id, setUserIDAndUsername, action.newUser),
        successMessage: null,
        errorMessage: null
      }
    case 'CREATION_SUCCESS':
      if (action.data === null) {
        return {
          ...state,
          successMessage: action.message
        }
      }
      return {
          ...state,
          successMessage: action.message,
          adjustments: adjustmentsDataReducer(action.data, updateDateAndId)
      }
    case 'CREATION_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        adjustments: adjustmentsDataReducer(state.adjustments, updateChanged),
        successMessage: action.message,
        errorMessage: null
      }
    case 'UPDATE_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'DELETE_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'SET_ADJUSTMENT_TO_REMOVE':
      return {
        ...state,
        toRemove: state.adjustments[getIndexById(action.id, state.adjustments)],
        showPopup: true
      }
    case 'CLOSE_DELETE_ADJUSTMENT_POPUP':
      return {
        ...state,
        toRemove: {},
        showPopup: false,
        removeSuccess: false
      }
    case 'DELETE_ADJUSTMENT_TO_REMOVE':
      return {
        ...state,
        adjustments: removeAdjustmentFromState(state.adjustments, state.toRemove),
        toRemove: {
          ...state.toRemove,
          removed: true
        },
        removeSuccess: true
      }
    default:
      return state;
  }
}


//TODO Yleistä tämä
function removeAdjustmentFromState(newData, toRemove) {
  const i = getIndexById(toRemove.id, newData);
  let updatedAdjustments = newData;
  updatedAdjustments = [
    ...updatedAdjustments.slice(0, i),
    ...updatedAdjustments.slice(i+1)
  ]
  return updatedAdjustments;
}

//TODO Yleistä tämä
function adjustmentsDataReducer(newData, updateFunction) {
  let i;
  let updatedAdjustments = newData;
  for(i = 0; i < newData.length; i++) {
    updatedAdjustments = [
      ...updatedAdjustments.slice(0, i),
      updateFunction(updatedAdjustments[i]),
      ...updatedAdjustments.slice(i+1)
    ]
  }
  return updatedAdjustments;
}

//TODO Yleistä tämä
function changeOneAdjustment(currentAdjustments, id, next, newValue) {
  let updatedAdjustments = currentAdjustments;
  const i = getIndexById(id, updatedAdjustments);
  updatedAdjustments = [
    ...updatedAdjustments.slice(0, i),
    next(updatedAdjustments[i], newValue),
    ...updatedAdjustments.slice(i+1),
  ]
  return updatedAdjustments;
}

//TODO Yleistä tämä. arrayhyn lisäämisen voi yleistää.
function newAdjustmentReducer(currentAdjustments, user) {
  return [
    ...currentAdjustments,
    {
      id: v4(),
      userid: user.id,
      username: user.username,
      amount: null,
      date: new Date().toISOString().substr(0,10),
      newadjustment: true,
      changed: false,
      toUIObject: adjustmentToUIObject(),
      isValid: function() {
        return isValidISODate(this.date) && isValidAmount(this.amount);
      }
    }
  ]
}

function updateDateAndId(a) {
  return {
    ...a,
    date: a.date,
    id: a.id.toString(),
    newadjustment: false,
    toUIObject: adjustmentToUIObject(),
    isValid: function() {
      return isValidISODate(this.date) && isValidAmount(this.amount);
    },
    changed: false
  }
}

function updateChanged(a) {
  return {
    ...a,
    changed: false
  }
}

function setAmount(a, amount) {
  return {
    ...a,
    amount: amount,
    changed: !a.newadjustment
  }
}

function setDate(a, date) {
  return {
    ...a,
    date: date,
    changed: !a.newadjustment
  }
}

function setUserIDAndUsername(a, user) {
  return {
    ...a,
    userid: user.id,
    username: user.username,
    changed: !a.newadjustment
  }
}

function adjustmentToUIObject() {
  return function() {
    return {
      "Käyttäjä": this.username,
      "Määrä": this.amount || 0,
      "Pvm": toFinnishDateString(this.date)
    }
  }
}
