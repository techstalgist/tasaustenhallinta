import React from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import HeaderRootWithRouter from './shared/components/header-root';
import LoginRoot from './login/components/login-root';
import GroupLoginRoot from './signup/components/group-login-root';
import SignUpRoot from './signup/components/signup-root';
import GroupSignUpRoot from './signup/components/group-signup-root';
import AdjustmentsRoot from './adjustments/components/adjustments-root';
import BillsRoot from './bills/components/bills-root';
import CategoriesRoot from './categories/components/categories-root';
import AnalysisRoot from './categories/components/analysis-root';
import UserInfoRoot from './login/components/user-info-root';
import Authenticate from './authenticate';
import ForgotPasswordRoot from './forgot-password/components/forgot-password-root';
import ResetPasswordRoot from './reset-password/components/reset-password-root';

const PrivateRoute = ({ component: Component, auth: Authenticate, ...rest }) => {
  const fromPath = rest.path;
  return (
    <Route {...rest} render={props => (
      Authenticate.isAuthenticated ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: Authenticate.getToPath(),
          state: { from: fromPath }
        }}/>
      )
    )}/>
  )
}

const RouterComponent = (props) => {
  const { store } = props;
  const userAuth = new Authenticate(store, 'USER');
  const userGroupAuth = new Authenticate(store, 'USER_GROUP');
  return (
    <BrowserRouter>
        <div>
          <HeaderRootWithRouter />
          <Route exact path="/" component={LoginRoot} />
          <Route exact path="/reset-password/:token" component={ResetPasswordRoot} />
          <Route path="/login" component={LoginRoot} />
          <Route path="/forgotpass" component={ForgotPasswordRoot} />
          <Route path="/grouplogin" component={GroupLoginRoot} />
          <Route path="/groupsignup" component={GroupSignUpRoot} />
          <PrivateRoute path="/auth/signup" component={SignUpRoot} auth={userGroupAuth} />
          <PrivateRoute path="/auth/adjustments" component={AdjustmentsRoot} auth={userAuth} />
          <PrivateRoute path="/auth/bills" component={BillsRoot} auth={userAuth} />
          <PrivateRoute path="/auth/categories" component={CategoriesRoot} auth={userAuth} />
          <PrivateRoute path="/auth/analysis" component={AnalysisRoot} auth={userAuth} />
          <PrivateRoute path="/auth/user" component={UserInfoRoot} auth={userAuth} />
        </div>
    </BrowserRouter>
  )
}

export default RouterComponent;
