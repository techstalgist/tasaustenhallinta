import React from 'react';

let UserDropdown = props => {

  const {next, dataID, defaultValue, domID, changeFunction, users, target} = props;
  return (
    <select className="form-control" id={domID} defaultValue={defaultValue} onChange={(e) => changeFunction(next, dataID, e, target)}>
      {users.map((u) => {
        return (<option value={u.id} key={u.id}>{u.username}</option>);
      })}
    </select>
  );
};

export default UserDropdown;
