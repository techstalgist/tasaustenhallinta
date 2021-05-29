function getInitialState() {
  return {
    errorMessage: null,
    successMessage: null,
    token: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'ADD_TOKEN':
      return {
        ...state,
        token: action.token
      }
    case 'RESET_SUCCESS':
      return {
        ...state,
        errorMessage: null,
        token: null,
        successMessage: action.message
      }
    case 'RESET_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    default:
      return state;
  }
}
