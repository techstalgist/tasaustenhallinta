import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import * as login from '../login';
import * as adjustments from '../adjustments';

export default combineReducers({
  adjustmentsData: adjustments.reducer,
  loginData: login.reducer,
  form: formReducer
});
