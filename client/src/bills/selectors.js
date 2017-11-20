export const getBillsForSelectedMonth = (bills, selectedMonth) => {
  const key = selectedMonth.toString();
  if (bills.hasOwnProperty(key)) {
    return bills[key];
  }
  return [];
};

export const getBills = (bills, isNew) => {
  let returnObj = {
    bills: [],
    allValid: true,
    monthsWithInvalid: new Set()
  };
  for (let k in bills) {
    for(let i = 0; i < bills[k].length; i++) {
      let b = bills[k][i];
      if (b.newbill === isNew) {
        returnObj.bills.push(b);
      }
      if (!b.isValid()) {
        returnObj.allValid = false;
        returnObj.monthsWithInvalid.add(k);
      }
    }
  }
  if (!returnObj.allValid) {
    const monthsArr = [...returnObj.monthsWithInvalid];
    returnObj.message = "Antamissasi tiedoissa on virheitä seuraavien kuukausien kohdalla: "+ monthsArr.join(", ") + ".";
  }
  return returnObj;
};
