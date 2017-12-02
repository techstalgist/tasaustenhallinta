import { v4 } from 'node-uuid';
import {toFinnishDateString, isValidISODate, isValidAmount} from '../shared/helpers';
import {updateArrayWithUpdateFunction, changeOneItemInArray, removeItemFromArray, getIndexById} from '../shared/reducer-helpers';

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
        adjustments: updateArrayWithUpdateFunction(action.data, updateDateAndId),
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
        adjustments: changeOneItemInArray(state.adjustments, action.id, setAmount, action.newAmount),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_DATE':
      return {
        ...state,
        adjustments: changeOneItemInArray(state.adjustments, action.id, setDate, action.newDate),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_COMMENT':
      return {
        ...state,
        adjustments: changeOneItemInArray(state.adjustments, action.id, setComment, action.newComment),
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_ADJUSTMENT_USER':
      return {
        ...state,
        adjustments: changeOneItemInArray(state.adjustments, action.id, setUserIDAndUsername, action.newUser),
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
          adjustments: updateArrayWithUpdateFunction(action.data, updateDateAndId)
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
        adjustments: updateArrayWithUpdateFunction(state.adjustments, updateChanged),
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
        adjustments: removeItemFromArray(state.adjustments, state.toRemove.id),
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
      comment: null,
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
  if (a.amount === amount) {
    return {...a};
  }
  return {
    ...a,
    amount: amount,
    changed: !a.newadjustment && (amount !== a.amount)
  }
}

function setComment(a, comment) {
  if ((a.comment === null || a.comment === '') && comment === '') {
    return {
      ...a
    }
  } else {
    return {
      ...a,
      comment: comment,
      changed: !a.newadjustment
    }
  }
}

function setDate(a, date) {
  if (a.date === date) {
    return {...a};
  }
  return {
    ...a,
    date: date,
    changed: !a.newadjustment
  }
}

function setUserIDAndUsername(a, user) {
  if (user.id === a.userid) {
    return {...a};
  }
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
