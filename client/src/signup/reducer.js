function getInitialState() {
  return {
    errorMessage: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'FAILED_SIGNUP':
      return {
        errorMessage: action.message
      };
    case 'HIDE_MESSAGES':
      return {
        errorMessage: null
      };
    default:
      return state;
  }
}
