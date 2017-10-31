import { v4 } from 'node-uuid';

function getInitialState() {
  return {
    bills: [],
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
