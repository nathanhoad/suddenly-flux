import { fromJS } from 'immutable';
import { State, Action, Reducer, Reducers } from './types';

/**
 * Convert a JS object to an Immutable.Map
 * @param object Any simple JS object
 */
export function createState(object: any): State {
  return fromJS(object);
}

/**
 * Combine reducers into a tree where the result state mirrors the tree structure
 * @param reducers A dictionary of reducers
 * @param sideEffect An optional side effect to run afterwards
 */
export function combineReducers(reducers: Reducers = {}, sideEffect?: (state: State) => void): Reducer {
  const keys = Object.keys(reducers);

  return (state?: State, action?: Action) => {
    if (!state) state = fromJS({});

    keys.forEach(key => {
      state = state.set(key, reducers[key](state.get(key), action));
    });

    if (typeof sideEffect === 'function') {
      sideEffect(state);
    }

    return state;
  };
}

/**
 * Create a basic reducer
 * @param initialState
 * @param reducers A dictionary of reducers
 * @param sideEffect An optional side effect to run afterwards
 */
export function createReducer(initialState: State, reducers: Reducers, sideEffect?: (state: State) => void): Reducer {
  const keys = Object.keys(reducers);

  return (state: State = initialState, action?: Action) => {
    if (!action || !action.type) return state;

    keys.forEach(constant => {
      if (action.type === constant) {
        state = reducers[constant](state, action);
      }
    });

    if (typeof sideEffect === 'function') {
      sideEffect(state);
    }

    return state;
  };
}
