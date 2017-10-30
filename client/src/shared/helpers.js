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
