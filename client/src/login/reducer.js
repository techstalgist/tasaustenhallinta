function getInitialState() {
  return {
    logInInfo: {
      loggedIn: false,
      token: null,
      user: null
    },
    errorMessage: null,
    successMessage: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        successMessage: action.message,
        errorMessage: null,
        logInInfo: {
          loggedIn: true,
          token: action.token,
          user: action.user
        }
      }
    case 'FAILED_LOGIN':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'LOGOUT':
      return {
        ...state,
        successMessage: "Uloskirjautuminen onnistui.",
        errorMessage: null,
        logInInfo: {
          loggedIn: false,
          token: null,
          user: null
        }
      }
    default:
      return state;
  }
}
