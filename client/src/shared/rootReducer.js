import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import { reducer as loginReducer} from '../login/reducer';
import { reducer as signUpReducer } from '../signup/reducer';
import { reducer as adjustmentsReducer } from '../adjustments/reducer';
import { reducer as billsReducer } from '../bills/reducer';
import { reducer as categoriesReducer } from '../categories/reducer';
import { reducer as sharedReducer } from './reducer';

export default combineReducers({
  adjustmentsData: adjustmentsReducer,
  loginData: loginReducer,
  form: formReducer,
  billsData: billsReducer,
  categoriesData: categoriesReducer,
  sharedData: sharedReducer,
  signUpData: signUpReducer
});
