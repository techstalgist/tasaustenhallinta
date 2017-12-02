export function getIndexById(id, arr) {
  const ids = arr.map( (a) => a.id );
  return ids.indexOf(id);
}

export function updateArrayWithUpdateFunction(newData, updateFunction) {
  let i;
  let updated = newData;
  for(i = 0; i < newData.length; i++) {
    updated = [
      ...updated.slice(0, i),
      updateFunction(updated[i]),
      ...updated.slice(i+1)
    ];
  }
  return updated;
}

export function changeOneItemInArray(currentArr, id, next, newValue) {
  let updated = currentArr;
  const i = getIndexById(id, currentArr);
  updated = [
    ...updated.slice(0, i),
    next(updated[i], newValue),
    ...updated.slice(i+1),
  ];
  return updated;
}

export function removeItemFromArray(arr, id) {
  const i = getIndexById(id, arr);
  let updated = arr;
  updated = [
    ...updated.slice(0, i),
    ...updated.slice(i+1)
  ];
  return updated;
}
