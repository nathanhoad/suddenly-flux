import { fromJS, Map } from "immutable";
import { State, Action, Reducer, Reducers } from "./types";

/**
 * Convert a JS object to an Immutable.Map
 * @param objectOrArray Any simple JS object
 * @param keyBy If given an array, use this field for keying to a Map
 */
export function createState(objectOrArray: Array<any> | object, keyBy: string = null): State {
  if (!(objectOrArray instanceof Array) || keyBy === null) return fromJS(objectOrArray);

  let map: any = {};
  (objectOrArray as Array<any>).forEach((item: any) => {
    map[item[keyBy]] = item;
  });

  return fromJS(map);
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

    if (typeof sideEffect === "function") {
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

    if (typeof sideEffect === "function") {
      sideEffect(state);
    }

    return state;
  };
}
