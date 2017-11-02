import fetch from 'isomorphic-fetch';

export function requestBills() {
  return {
    type: 'REQUEST_BILLS'
  };
}

export function receiveBills(json) {
  return {
    type: 'RECEIVE_BILLS',
    monthYear: json.monthYear,
    data: json.data
  };
}

export function changeMonth(newMonth) {
  return (dispatch, getState) => {
    dispatch({
      type: 'CHANGE_MONTH',
      monthString: newMonth
    });
    if (!getState().billsData.bills.hasOwnProperty(newMonth)) {
      dispatch(fetchBills());
    }
  };
}

export function fetchBills() {
  return function (dispatch, getState) {
    dispatch(requestBills());
    const selectedMonth = getState().billsData.selectedMonth;
    const apiCallAddress = '/bills/' + selectedMonth.year + '/' + selectedMonth.month;
    const token = getState().loginData.logInInfo.token;
    const headers = new Headers({ 'Authorization': `JWT ${token}` });
    const request = new Request(apiCallAddress, {
      method: 'GET',
      headers: headers
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveBills(json))
      )
      .catch(err => console.error(err));
  };
}
