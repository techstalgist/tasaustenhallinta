export const getAdjustments = (adjustments, isNew) => adjustments.filter(a => a.newadjustment === isNew);

export function validateAdjustments(adjustments) {
  for (let i = 0; i < adjustments.length; i++) {
    if (!adjustments[i].isValid()) {
      return false;
    }
  }
  return true;
}
