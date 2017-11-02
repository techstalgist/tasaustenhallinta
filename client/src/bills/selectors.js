export const getBillsForSelectedMonth = (bills, selectedMonth) => {
  const key = selectedMonth.toString();
  if (bills.hasOwnProperty(key)) {

    return bills[key];
  }
  return [];
};
