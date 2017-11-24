export const getDefaultCategory = (categories) => categories.filter((c) => c.name === "Ruokaostokset")[0];

export function getCategories (categories, isNew) {
  let data = [];
  for (let i = 0; i < categories.length; i++) {
    let a = categories[i];
    if (isNew && a.newcategory) {
      data.push(a);
    } else if (a.changed && !isNew) {
      data.push(a);
    }
  }
  return data;
}
