import * as moment from 'moment';

export function serialize(obj) {
  let str = [];
  for(let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export function toFinnishDateString(isoDate) {
  return moment(isoDate).format('DD.MM.YYYY');
}

export function toISOCompatibleString(finDate) {
  return moment(finDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
}

export function isValidFinnishDate(date) {
  return moment(date, 'DD.MM.YYYY').isValid();
}

export function showRounded(number, precision) {
  return number.toFixed(precision).replace(".", ",");
}

export function handleAmountChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  next("amount", id, e.target.value, target);
}

export function handleUserChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  const username = e.target.options[e.target.options.selectedIndex].text;
  const user = {
    id: parseInt(e.target.value, 10),
    username: username
  };
  next("user", id, user, target);
}

export function handleDateChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  if (isValidFinnishDate(e.target.value)) {
    const isoDate = toISOCompatibleString(e.target.value);
    next("date", id, isoDate, target);
  } else {
    // change CSS style, maybe via Redux dispatch
  }
}
