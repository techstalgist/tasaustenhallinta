export const getUser = (users, id) => users.filter((u) => u.id === id)[0];

export const getUserByName = (users, name) => users.filter((u) => u.username === name)[0];

export const getSelectedUsers = (users) => {
  return users.filter((u) => u.selectedForAnalysis).map((u) => u.id);
};
