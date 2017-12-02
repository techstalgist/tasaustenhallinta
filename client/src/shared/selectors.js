export const getUser = (users, id) => users.filter((u) => u.id === id)[0];

export const getSelectedUsers = (users) => {
  return users.filter((u) => u.selectedForAnalysis).map((u) => u.id);
};
