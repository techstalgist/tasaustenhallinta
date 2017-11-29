export default class Authenticate {
  constructor(store, authMode) {
    this.store = store;
    this.authMode = authMode;
    //the following enables direct login because Redux store is now persisted in local storage.
    // may not fully work after token has expired...
    this.isAuthenticated = this.getLoggedIn(this.store.getState(), this.authMode);
    this.getToPath = () => {
      switch (this.authMode) {
        case 'USER_GROUP':
          return '/grouplogin';
        default:
          return '/login';
      }
    };
    this.listener = () => {
      this.isAuthenticated = this.getLoggedIn(this.store.getState(), this.authMode);
    };
    this.store.subscribe(this.listener);

  }
  getLoggedIn(state, mode) {
    switch (mode) {
      case 'USER_GROUP':
        return state.signUpData.loggedIntoGroup;
      default:
        return state.loginData.logInInfo.loggedIn;
    }
  }
}
