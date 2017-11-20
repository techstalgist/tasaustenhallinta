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
  if (moment(isoDate, 'YYYY-MM-DD', true).isValid()) {
    return moment(isoDate).format('DD.MM.YYYY');
  } else {
    return isoDate;
  }
}

export function toISOCompatibleString(finDate) {
  return moment(finDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
}

export function isValidFinnishDate(date) {
  return moment(date, 'DD.MM.YYYY', true).isValid();
}

export function isValidISODate(date) {
  return moment(date, 'YYYY-MM-DD', true).isValid();
}

export function showRounded(number, precision) {
  return number.toFixed(precision).replace(".", ",");
}

export function getCssForDateField(otherCss, value) {
  if (isValidISODate(value)) {
    return otherCss;
  } else {
    return otherCss + " danger";
  }
}

export function isValidAmount(value) {
  return !(value === null || value.length === 0);
}

export function getCssForNumberField(otherCss, value) {
  if (isValidAmount(value)) {
    return otherCss;
  } else {
    return otherCss + " danger";
  }
}

export function toProperCase(text) {
  return text.charAt(0).toUpperCase() + text.substring(1);
}
