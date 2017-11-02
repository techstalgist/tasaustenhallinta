import React from 'react';
import { showRounded } from '../../shared/helpers';

function calculateAmountsForUsers(bills) {
    let amountsForUsers = {
      users: {},
      total: 0.0
    };
    for (let i = 0; i < bills.length; i++) {
      let b = bills[i];
      const amount = parseFloat(b.amount);
      if(!amountsForUsers.users.hasOwnProperty(b.username)) {
        amountsForUsers.users[b.username] = amount;
      } else {
        amountsForUsers.users[b.username] += amount;
      }
      amountsForUsers.total += amount;
    }
    return amountsForUsers;
}

function calculateAdjustment(paid, total) {
  return Math.max(total/2-paid,0);
}

const AmountsForUsers = (props) => {
    const {bills} = props;
    const amountsForUsers = calculateAmountsForUsers(bills);
    return(

        <table className="table-sm">
          <thead className="thead-light">
            <tr>
              <th>Käyttäjä</th>
              <th>Maksanut yht</th>
              <th>Tasaus €</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(amountsForUsers.users).map((k) => (
                <tr key={k}>
                  <td className="text-right">
                    {k}
                  </td>
                  <td className="text-right">
                    {showRounded(amountsForUsers.users[k])} €
                  </td>
                  <td className="text-right">
                    {showRounded(calculateAdjustment(amountsForUsers.users[k],amountsForUsers.total))} €
                  </td>
                </tr>
             )
            )}
            <tr>
              <td className="text-right">
                 Yht
              </td>
              <td className="text-right"><strong> {showRounded(amountsForUsers.total)} € </strong>
              </td>
            </tr>
          </tbody>
        </table>
    )
};

export default AmountsForUsers;
