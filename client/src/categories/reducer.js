//import { v4 } from 'node-uuid';

function getInitialState() {
  return {
    categories: [],
    dataReceived: false,
    successMessage: null,
    errorMessage: null,
    analysisDataReceived: false,
    analysisData: {}
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'REQUEST_CATEGORIES':
      return {
        ...state,
        dataReceived: false
      }
    case 'RECEIVE_CATEGORIES':
      return {
        ...state,
        dataReceived: true,
        categories: action.data
      }
    case 'RECEIVE_ANALYSIS_DATA':
      return {
        ...state,
        analysisDataReceived: true,
        analysisData: action.data
      }
    default:
      return state;
  }
}
