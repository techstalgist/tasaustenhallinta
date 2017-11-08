export const getBillsForSelectedMonth = (bills, selectedMonth) => {
  const key = selectedMonth.toString();
  if (bills.hasOwnProperty(key)) {
    return bills[key];
  }
  return [];
};

export const getBills = (bills, isNew) => {
  const billsToReturn = [];
  for (let k in bills) {

    for(let i = 0; i < bills[k].length; i++) {
      let b = bills[k][i];
      if (b.newbill === isNew) {
        billsToReturn.push(b);
      }
    }
  }
  return billsToReturn;
};
