import React from 'react';
import UserRow from './user-row';
import { showRounded } from '../../shared/helpers';
import TableHeaders from '../../shared/components/table/table-headers';
import {getUserByName} from '../../shared/selectors';

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
    const {bills, users, addAdjustment, month} = props;
    const amountsForUsers = calculateAmountsForUsers(bills, users);
    const userCount = Object.keys(amountsForUsers.users).length;
    const headersData = [
      {cssClass: "text-right", title: "Käyttäjä"},
      {cssClass: "text-right", title: "Maksanut yht"},
      {cssClass: "text-right", title: "Tasaus €"},
      {cssClass: "", title:""}
    ];
    return(
        <table className="table table-sm border">
          <TableHeaders headers={headersData} rowClass=""/>
          <tbody>
            {Object.keys(amountsForUsers.users).map((k) => (
              <UserRow month={month} key={k} k={k} user={getUserByName(users,k)} paidAmount={showRounded(amountsForUsers.users[k], 2)}
                        adjustment={calculateAdjustment(amountsForUsers.users[k],amountsForUsers.total, userCount)}
                        addAdjustment={addAdjustment} />
             )
            )}
            <tr>
              <td className="text-right">
                 <strong>Yhteensä</strong>
              </td>
              <td className="text-right"><strong> {showRounded(amountsForUsers.total, 2)} € </strong>
              </td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
    )
};

export default AmountsForUsers;
