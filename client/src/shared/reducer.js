import {updateArrayWithUpdateFunction, changeOneItemInArray} from '../shared/reducer-helpers';

function getInitialState() {
  return {
    users: [],
    usersDataReceived: false
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'REQUEST_USERS':
      return {
        ...state,
        usersDataReceived: false
      };
    case 'RECEIVE_USERS':
      return {
        ...state,
        usersDataReceived: true,
        users: updateArrayWithUpdateFunction(action.data, updateSelected)
      }
    case 'CHANGE_USER_SELECTED':
      return {
        ...state,
        users: changeOneItemInArray(state.users, action.id, setSelected, action.newSelected)
      }
    default:
      return state;
  }
}

function updateSelected(u) {
  return {
    ...u,
    selectedForAnalysis: true
  }
}

function setSelected(u, val) {
  return {
    ...u,
    selectedForAnalysis: !u.selectedForAnalysis
  }
}
