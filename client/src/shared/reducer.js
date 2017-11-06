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
      users: action.data
    }
    default:
      return state;
  }
}
