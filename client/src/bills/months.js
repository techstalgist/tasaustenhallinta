export function Month(year, month) {
  this.year = year;
  this.month = month;
  this.toString = function() {
    return this.month + "/" + this.year;
  };
  this.getAsDate = function() {
    return new Date(this.year, this.month-1, 1);
  };
}

export function getCurrentMonth() {
  const curDate = new Date();
  return new Month(curDate.getFullYear(), curDate.getMonth()+1);
}

export function getMonth(monthString, months) {
  return months.filter((m) => m.toString() === monthString)[0];
}

export function compareMonths(m1, m2) {
  const d1 = new Date(m1.year, m1.month-1, 1);
  const d2 = new Date(m2.year, m2.month-1, 1);
  if (d2 > d1) { return 1;}
  if (d1 > d2) { return -1;}
  return 0;
}

export function getMonths(untilDate) {
  const untilDatePlusOneMonth = new Date(untilDate);
  untilDatePlusOneMonth.setMonth(untilDatePlusOneMonth.getMonth()+1);
  let rollingDate = new Date('2013-01-01');
  let months = [];
  while(rollingDate <= untilDatePlusOneMonth) {
    let m = new Month(rollingDate.getFullYear(),rollingDate.getMonth()+1);
    months.push(m);
    rollingDate.setMonth(rollingDate.getMonth()+1);
  }
  return months.sort(compareMonths);
}
