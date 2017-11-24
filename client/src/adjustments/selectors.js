export function getAdjustments (adjustments, isNew) {
  let data = [];
  for (let i = 0; i < adjustments.length; i++) {
    let a = adjustments[i];
    if (isNew && a.newadjustment) {
      data.push(a);
    } else if (a.changed && !isNew) {
      data.push(a);
    }
  }
  return data;
}
