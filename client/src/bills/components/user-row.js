import React from 'react';
import { showRounded } from '../../shared/helpers';

const UserRow = (props) => {
    const {k, user, paidAmount, adjustment, addAdjustment} = props;
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
              <button onClick={(e) => addAdjustment(user, parseFloat(adjustment.toFixed(2)))} type="button" className="btn btn-primary btn-sm">Luo tasaus</button>
            </td>
          </tr>
      )
};

export default UserRow;
