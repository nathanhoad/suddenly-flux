import * as React from 'react';
import * as merge from 'object-assign';
import {
  Reducer,
  State,
  Action,
  EventualAction,
  MapStateToPropsFunction,
  MapDispatchToPropsFunction,
  ChangeListener
} from './types';

export class Store {
  state: State;
  reducer: Reducer;

  listeners: ChangeListener[];

  constructor(initialState: State, reducer: Reducer) {
    this.state = initialState !== null ? initialState : reducer();
    this.reducer = reducer;

    this.listeners = [];
  }

  public addListener(handler: ChangeListener): void {
    this.listeners = this.listeners.concat(handler);
  }

  public removeListener(handler: ChangeListener): void {
    this.listeners = this.listeners.filter(event => event !== handler);
  }

  onStateChanged() {
    this.listeners.forEach(listener => {
      listener(this.getState());
    });
  }

  public getState(): State {
    return this.state;
  }

  public dispatch(action: Action | EventualAction) {
    // If the action is a function then run it first
    if (typeof action === 'function') {
      action(this.dispatch.bind(this), this.getState.bind(this));
    } else if (typeof action !== 'undefined') {
      // Otherwise we should have something we can give to the reducer
      this.state = this.state.merge(this.reducer(this.getState(), action as Action));
      this.onStateChanged();
    }
  }
}

let store: Store;

const Context = React.createContext({});

export type ProviderProps = {
  store?: Store;
  reducer?: Reducer;
  children: any;
};

export function Provider(props: ProviderProps) {
  if (!props.store && !props.reducer) {
    throw new Error('You need to provide either a Store or a reducer function');
  }

  if (!store) {
    store = props.store || new Store(props.reducer(), props.reducer);
  }

  const [providedState, setProvidedState] = React.useState(store.getState());

  React.useEffect(() => {
    store.addListener(setProvidedState);
    return () => {
      store.removeListener(setProvidedState);
    };
  }, [providedState]);

  // Add the listener initially
  // The Effect above only starts listening after everything is rendered
  // but we might need to know about stuff before then
  store.addListener(setProvidedState);

  return (
    <Context.Provider
      value={{
        state: providedState,
        dispatch: store.dispatch.bind(store)
      }}>
      {props.children}
    </Context.Provider>
  );
}

/**
 * Returns a HOC that injects state and dispatch from the Provider
 * @param mapStateToProps
 * @param mapDispatchToProps
 */
export function connect(mapStateToProps?: MapStateToPropsFunction, mapDispatchToProps?: MapDispatchToPropsFunction) {
  return (Component: React.ElementType) => {
    return (props: any) => {
      return (
        <Context.Consumer>
          {(context: any) => {
            let mappedState: any = {};
            if (mapStateToProps) {
              mappedState = mapStateToProps(context.state, props);
              // Check for a memoized selector
              if (typeof mappedState === 'function') {
                mappedState = mappedState(context.state, props);
              }
            }

            let mappedDispatch: any = mapDispatchToProps ? mapDispatchToProps(context.dispatch, props) : {};
            props = merge({}, props, mappedState, mappedDispatch);

            return <Component {...props} />;
          }}
        </Context.Consumer>
      );
    };
  };
}
