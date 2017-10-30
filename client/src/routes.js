import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import HeaderRootWithRouter from './shared/components/header-root';
import LoginRoot from './login/components/login-root';
import AdjustmentsRoot from './adjustments/components/adjustments-root';
import Authenticate from './authenticate';

const PrivateRoute = ({ component: Component, auth: Authenticate, ...rest }) => {
  const fromPath = rest.path;
  return (
    <Route {...rest} render={props => (
      Authenticate.isAuthenticated ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: fromPath }
        }}/>
      )
    )}/>
  )
}

const RouterComponent = (props) => {
  const { store } = props;
  const auth = new Authenticate(store);
  return (
    <BrowserRouter>
        <div>
          <HeaderRootWithRouter />
          <Route exact path="/" render={() => (<Redirect to="/login"/>)}/>
          <Route path="/login" component={LoginRoot} />
          <PrivateRoute path="/auth/adjustments" component={AdjustmentsRoot} auth={auth} />
        </div>
    </BrowserRouter>
  )
}

export default RouterComponent;
