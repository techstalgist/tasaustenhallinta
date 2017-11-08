export const getBillsForSelectedMonth = (bills, selectedMonth) => {
  const key = selectedMonth.toString();
  if (bills.hasOwnProperty(key)) {

    return bills[key].sort(compareBills); // this can be a bit confusing...
  }
  return [];
};

export function compareBills(b1, b2) {
  const d1 = new Date(b1.date);
  const d2 = new Date(b2.date);
  if (d2 > d1) { return -1;}
  if (d1 > d2) { return 1;}
  return 0;
}
