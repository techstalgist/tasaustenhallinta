import React from 'react';

let UserDropdown = props => {

  const {next, dataID, value, changeFunction, users, target} = props;
  return (
    <select className="form-control p-1" value={value} onChange={(e) => changeFunction(next, dataID, e, target)}>
      {users.map((u) => {
        return (<option value={u.id} key={u.id}>{u.username}</option>);
      })}
    </select>
  );
};

export default UserDropdown;
