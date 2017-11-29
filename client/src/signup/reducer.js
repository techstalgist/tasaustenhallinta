function getInitialState() {
  return {
    userGroup: { },
    loggedIntoGroup: false,
    errorMessage: null,
    successMessage: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'GROUP_LOGIN':
      return {
        ...state,
        successMessage: action.message,
        loggedIntoGroup: true,
        errorMessage: null,
        userGroup: action.userGroup
      }
    case 'FAILED_GROUP_LOGIN':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'FAILED_SIGNUP':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      };
    case 'HIDE_MESSAGES':
      return {
        ...state,
        errorMessage: null,
        successMessage: null
      };
    default:
      return state;
  }
}
