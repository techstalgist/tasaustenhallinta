import { v4 } from 'node-uuid';
import {toFinnishDateString} from '../shared/helpers';

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
        errorMessage: action.message
      }
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        successMessage: action.message
      }
    case 'UPDATE_FAILURE':
      return {
        ...state,
        errorMessage: action.message
      }
    case 'SET_ADJUSTMENT_TO_REMOVE':
      return {
        ...state,
        toRemove: state.adjustments[getAdjustmentIndexById(action.id, state.adjustments)],
        showPopup: true
      }
    case 'SUBMIT_DELETE_ADJUSTMENT':
      return {
        ...state,
        removeSuccess: true
      }
    case 'CLOSE_DELETE_ADJUSTMENT_POPUP':
      return {
        ...state,
        toRemove: {},
        showPopup: false,
        removeSuccess: false
      }
    default:
      return state;
  }
}

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


function changeOneAdjustment(currentAdjustments, id, callback, newValue) {
  let updatedAdjustments = currentAdjustments;
  const i = getAdjustmentIndexById(id, updatedAdjustments);
  updatedAdjustments = [
    ...updatedAdjustments.slice(0, i),
    callback(updatedAdjustments[i], newValue),
    ...updatedAdjustments.slice(i+1),
  ]
  return updatedAdjustments;
}

function adjustmentToString() {
  return function() {
    return "Käyttäjä: " + this.username + ", Määrä: " + (this.amount || 0) + ", Pvm: " + toFinnishDateString(this.date);
  }
}

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
      toString: adjustmentToString()
    }
  ]
}

function updateDateAndId(a) {
  return {
    ...a,
    date: a.date,
    id: a.id.toString(),
    newadjustment: false,
    toString: adjustmentToString()
  }
}

function setAmount(a, amount) {
  return {
    ...a,
    amount: amount
  }
}

function setDate(a, date) {
  return {
    ...a,
    date: date
  }
}

function setUserIDAndUsername(a, user) {
  return {
    ...a,
    userid: user.id,
    username: user.username
  }
}

function getAdjustmentIndexById(id, adjustments) {
  const ids = adjustments.map( (a) => a.id );
  return ids.indexOf(id);
}
