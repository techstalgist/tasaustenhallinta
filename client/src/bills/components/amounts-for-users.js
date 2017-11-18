import React from 'react';
import { showRounded } from '../../shared/helpers';
import TableHeaders from '../../shared/components/table/table-headers';

function calculateAmountsForUsers(bills, users) {
    let amountsForUsers = {
      users: initializeUsers(users),
      total: 0.0
    };
    for (let i = 0; i < bills.length; i++) {
      let b = bills[i];
      const amount = parseFloat(b.amount) || 0;
      if(!amountsForUsers.users.hasOwnProperty(b.username)) {
        amountsForUsers.users[b.username] = amount;
      } else {
        amountsForUsers.users[b.username] += amount;
      }
      amountsForUsers.total += amount;
    }
    return amountsForUsers;
}

function initializeUsers(users) {
  let obj = {};
  for (let i = 0; i < users.length; i++) {
    obj[users[i].username] = 0.0;
  }
  return obj;
}

function calculateAdjustment(paid, total, userCount) {
  return Math.max(total/userCount-paid,0);
}

const AmountsForUsers = (props) => {
    const {bills, users} = props;
    const amountsForUsers = calculateAmountsForUsers(bills, users);
    const userCount = Object.keys(amountsForUsers.users).length;
    const headersData = [
      {cssClass: "text-right", title: "Käyttäjä"},
      {cssClass: "text-right", title: "Maksanut yht"},
      {cssClass: "text-right", title: "Tasaus €"}
    ];
    return(
        <table className="table table-sm border">
          <TableHeaders headers={headersData} rowClass=""/>
          <tbody>
            {Object.keys(amountsForUsers.users).map((k) => (
                <tr key={k}>
                  <td className="text-right">
                    {k}
                  </td>
                  <td className="text-right">
                    {showRounded(amountsForUsers.users[k], 2)} €
                  </td>
                  <td className="text-right">
                    {showRounded(calculateAdjustment(amountsForUsers.users[k],amountsForUsers.total, userCount), 2)} €
                  </td>
                </tr>
             )
            )}
            <tr>
              <td className="text-right">
                 <strong>Yhteensä</strong>
              </td>
              <td className="text-right"><strong> {showRounded(amountsForUsers.total, 2)} € </strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
    )
};

export default AmountsForUsers;
