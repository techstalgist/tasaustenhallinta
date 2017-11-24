import {isValidFinnishDate, toISOCompatibleString } from '../../helpers';

export function handleAmountChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  next("amount", id, e.target.value, target, e.target.value.length > 0);
}

export function handleUserChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  const username = e.target.options[e.target.options.selectedIndex].text;
  const user = {
    id: parseInt(e.target.value, 10),
    username: username
  };
  next("user", id, user, target, true);
}

export function handleCategoryChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  const categoryname = e.target.options[e.target.options.selectedIndex].text;
  const category = {
    id: parseInt(e.target.value, 10),
    name: categoryname
  };
  next("category", id, category, target, true);
}

export function handleDateChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  if (isValidFinnishDate(e.target.value)) {
    const isoDate = toISOCompatibleString(e.target.value);
    next("date", id, isoDate, target, true);
  } else {
    next("date", id, e.target.value, target, false);
  }
}

export function handleNameChange (next, id, e, target) {
  e.preventDefault();
  e.stopPropagation();
  next("name", id, e.target.value, target, true);
}
