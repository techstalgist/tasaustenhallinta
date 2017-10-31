import { v4 } from 'node-uuid';

function getInitialState() {
  return {
    categories: [],
    dataReceived: false,
    successMessage: null,
    errorMessage: null
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    default:
      return state;
  }
}
