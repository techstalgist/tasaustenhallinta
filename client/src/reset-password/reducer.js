function getInitialState() {
  return {
    errorMessage: null,
    successMessage: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'FORGOT_SUCCESS':
      return {
        ...state,
        errorMessage: null,
        successMessage: action.message
      }
    case 'FORGOT_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    default:
      return state;
  }
}
