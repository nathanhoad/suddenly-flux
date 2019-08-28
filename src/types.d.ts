import { Map } from 'immutable';

export type Dictionary<T> = {
  [key: string]: T;
};

export type ChangeListener = (state: State) => void;

export type State = Map<any, any>;

export type Action = {
  type: any;
  payload?: any;
};

export type EventualAction = (dispatch: Dispatch, getState?: () => State) => void;

export type Dispatch = (action: Action | EventualAction) => void;

export type Reducer = (state?: State, action?: Action) => State;

export type Reducers = {
  [key: string]: Reducer;
};

export type MapStateToPropsFunction = (state: State, props?: any) => Dictionary<any> | MapStateToPropsFunction;
export type MapDispatchToPropsFunction = (dispatch: Action, props?: any) => void;
