export default class Authenticate {
  constructor(store) {
    this.store = store;
    //the following enables direct login because Redux store is now persisted in local storage.
    // may not fully work after token has expired...
    this.isAuthenticated = this.getLoggedIn(this.store.getState());
    this.listener = () => {
      this.isAuthenticated = this.getLoggedIn(this.store.getState());
    };
    this.store.subscribe(this.listener);
  }
  getLoggedIn(state) {
    return state.loginData.logInInfo.loggedIn;
  }
}
