import { v4 } from 'node-uuid';
import {isValidName} from '../shared/helpers';
import {updateArrayWithUpdateFunction, changeOneItemInArray, removeItemFromArray, getIndexById} from '../shared/reducer-helpers';

function getInitialState() {
  return {
    categories: [],
    dataReceived: false,
    successMessage: null,
    errorMessage: null,
    analysisDataReceived: false,
    analysisData: {},
    toRemove: {},
    removeSuccess: false,
    showPopup: false
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'CLEAN_CATEGORIES_STATE':
      return getInitialState();
    case 'HIDE_MESSAGES':
      return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'SHOULD_FETCH_CATEGORIES':
      return {
        ...state,
        dataReceived: false,
        analysisDataReceived: false
      }
    case 'REQUEST_CATEGORIES':
      return {
        ...state,
        dataReceived: false
      }
    case 'RECEIVE_CATEGORIES':
      return {
        ...state,
        dataReceived: true,
        categories: updateArrayWithUpdateFunction(action.data, handleCategoryFromBackend)
      }
    case 'NEW_CATEGORY':
      return {
        ...state,
        categories: newCategoryReducer(state.categories),
        successMessage: null,
        errorMessage: null
      }
    case 'RECEIVE_ANALYSIS_DATA':
      return {
        ...state,
        analysisDataReceived: true,
        analysisData: action.data
      }
    case 'SUBMIT_CATEGORY_UPDATE':
       return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'SUBMIT_CATEGORIES':
       return {
        ...state,
        successMessage: null,
        errorMessage: null
      }
    case 'CHANGE_CATEGORY_NAME':
      return {
        ...state,
        categories: changeOneItemInArray(state.categories, action.id, updateName, action.newName)
      }
    case 'SET_CATEGORY_TO_REMOVE':
      return {
        ...state,
        toRemove: state.categories[getIndexById(action.id, state.categories)],
        showPopup: true
      }
    case 'CLOSE_DELETE_CATEGORY_POPUP':
      return {
        ...state,
        toRemove: {},
        showPopup: false,
        removeSuccess: false
      }
    case 'DELETE_CATEGORY_TO_REMOVE':
      return {
        ...state,
        categories: action.didRemove ? removeItemFromArray(state.categories, state.toRemove.id) : changeOneItemInArray(state.categories, state.toRemove.id, updateBillCount, 0),
        toRemove: {
          ...state.toRemove,
          removed: true
        },
        removeSuccess: true
      }
    case 'CATEGORY_CREATION_SUCCESS':
      if (action.data === null) {
        return {
          ...state,
          successMessage: action.message
        }
      }
      return {
          ...state,
          successMessage: action.message,
          categories: updateArrayWithUpdateFunction(action.data, handleCategoryFromBackend)
      }
    case 'CATEGORY_CREATION_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'CATEGORY_UPDATE_SUCCESS':
      return {
        ...state,
        categories: updateArrayWithUpdateFunction(state.categories, updateChanged),
        successMessage: action.message,
        errorMessage: null
      }
    case 'CATEGORY_UPDATE_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    case 'DELETE_CATEGORY_FAILURE':
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null
      }
    default:
      return state;
  }
}

//TODO Yleistä tämä. newCategory -kutsu luo uuden objektin. Mutta arrayhyn lisäämisen voi yleistää.
function newCategoryReducer(categories) {
  return [
    ...categories,
    {
      id: v4(),
      name: "",
      isValid: function() {
        return isValidName(this.name);
      },
      newcategory: true,
      changed: false,
      bills_count: 0,
      toUIObject: categoryToUIObject()
    }
  ]
}

function handleCategoryFromBackend(c) {
  return {
    ...c,
    id: c.id,
    newcategory: false,
    changed: false,
    isValid: function() {
      return isValidName(this.name);
    },
    bills_count: parseInt(c.bills_count,10),
    toUIObject: categoryToUIObject()
  }
}

function updateName(c, name) {
  if (name === c.name) {
    return {...c};
  }
  return {
    ...c,
    name: name,
    changed: !c.newcategory
  }
}

function updateChanged(c) {
  return {
    ...c,
    changed: false
  }
}

function updateBillCount(c, count) {
  return {
    ...c,
    bills_count: count
  }
}

function categoryToUIObject() {
  return function() {
    return {
      "Nimi": this.name,
      "Laskujen lkm": this.bills_count
    }
  }
}
