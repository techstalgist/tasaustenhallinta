import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import HeaderRootWithRouter from './shared/components/header-root';
import LoginRoot from './login/components/login-root';
import SignUpRoot from './signup/components/signup-root';
import AdjustmentsRoot from './adjustments/components/adjustments-root';
import BillsRoot from './bills/components/bills-root';
import CategoriesRoot from './categories/components/categories-root';
import AnalysisRoot from './categories/components/analysis-root';
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
          <Route path="/signup" component={SignUpRoot} />
          <PrivateRoute path="/auth/adjustments" component={AdjustmentsRoot} auth={auth} />
          <PrivateRoute path="/auth/bills" component={BillsRoot} auth={auth} />
          <PrivateRoute path="/auth/categories" component={CategoriesRoot} auth={auth} />
          <PrivateRoute path="/auth/analysis" component={AnalysisRoot} auth={auth} />
        </div>
    </BrowserRouter>
  )
}

export default RouterComponent;
