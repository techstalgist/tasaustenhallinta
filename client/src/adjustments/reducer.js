import { v4 } from 'node-uuid';

function getInitialState() {
  return {
    adjustments: [],
    dataReceived: false,
    successMessage: null,
    errorMessage: null
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
        ...state
      };
    case 'SUBMIT_UPDATE':
      return {
        ...state
      };
    case 'RECEIVE':
      return {
        ...state,
        adjustments: adjustmentsDataReducer(action.data, updateDateAndId),
        dataReceived: true
      };
    case 'DATA_NOT_RECEIVED':
      return getInitialState();
    case 'NEW_ADJUSTMENT':
      return {
        ...state,
        adjustments: newAdjustmentReducer(state.adjustments, action.user)
      }
    case 'CHANGE_AMOUNT':
      return {
        ...state,
        adjustments: changeOneAdjustment(state.adjustments, action.id, setAmount, action.newAmount)
      }
    case 'CHANGE_DATE':
      return {
        ...state,
        adjustments: changeOneAdjustment(state.adjustments, action.id, setDate, action.newDate)
      }
    case 'CREATION_SUCCESS':
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
      ...updatedAdjustments.slice(i+1),
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

function newAdjustmentReducer(currentAdjustments, user) {
  return [
    ...currentAdjustments,
    {
      id: v4(),
      userid: user.id,
      username: user.username,
      amount: null,
      date: new Date().toISOString().substr(0,10),
      newadjustment: true
    }
  ]
}

function updateDateAndId(a) {
  return {
    ...a,
    date: a.date,
    id: a.id.toString(),
    newadjustment: false
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

function getAdjustmentIndexById(id, adjustments) {
  const ids = adjustments.map( (a) => a.id );
  return ids.indexOf(id);
}
