import React from 'react';
import { showRounded } from '../../shared/helpers';
import {withRouter} from 'react-router-dom';

let UserRow = (props) => {
    const {month, k, user, paidAmount, adjustment, addAdjustment, history} = props;
    return(
          <tr key={k}>
            <td className="text-right">
              {k}
            </td>
            <td className="text-right">
              {paidAmount} €
            </td>
            <td className="text-right">
              {showRounded(adjustment,2)} €
            </td>
            <td className="text-right">
              <button onClick={(e) => {
                                  addAdjustment(user, parseFloat(adjustment.toFixed(2)), month);
                                  history.push('/auth/adjustments');
                              }} type="button" className="btn btn-primary btn-sm">Luo tasaus</button>
            </td>
          </tr>
      )
};

UserRow = withRouter(UserRow);

export default UserRow;
