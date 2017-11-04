import { combineReducers } from 'redux';
import { reducer as formReducer} from 'redux-form';
import * as login from '../login';
import * as adjustments from '../adjustments';
import * as bills from '../bills';
import * as categories from '../categories';

export default combineReducers({
  adjustmentsData: adjustments.reducer,
  loginData: login.reducer,
  form: formReducer,
  billsData: bills.reducer,
  categoriesData: categories.reducer
});
