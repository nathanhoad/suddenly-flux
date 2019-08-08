import { Map } from 'immutable';

export type Dictionary = {
  [key: string]: any;
};

export type State = Map<any, any>;

export type Action = {
  type: any;
  payload?: any;
};

export type EventualAction = (getState?: () => State, dispatch?: (action: Action) => void) => Action;

export type Reducer = (state?: State, action?: Action) => State;

export type Reducers = {
  [key: string]: Reducer;
};

export type MapStateToPropsFunction = (state: State, props?: any) => Dictionary | MapStateToPropsFunction;
export type MapDispatchToPropsFunction = (dispatch: Action, props?: any) => void;
