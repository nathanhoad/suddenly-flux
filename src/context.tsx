import * as React from 'react';
import * as merge from 'object-assign';
import { Reducer, State, Action, EventualAction, MapStateToPropsFunction, MapDispatchToPropsFunction } from './types';

export class Store {
  state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  public getState(): State {
    return this.state;
  }

  public mergeState(state: State): State {
    this.state = this.state.merge(state);
    return this.getState();
  }
}

let store: Store;

const Context = React.createContext({});

export type ProviderProps = {
  reducer: Reducer;
  children: any;
};

export function Provider(props: ProviderProps) {
  if (!store) {
    store = new Store(props.reducer());
  }

  const [providedState, setProvidedState] = React.useState(store.getState());

  function dispatch(action: Action | EventualAction): void {
    // If the action is a function then run it first
    if (typeof action === 'function') {
      dispatch(action(store.getState.bind(store), dispatch));
    } else if (typeof action !== 'undefined') {
      // Otherwise we should have something we can give to the reducer
      store.mergeState(props.reducer(store.getState(), action as Action));
      setProvidedState(store.getState());
    }
  }

  return (
    <Context.Provider
      value={{
        state: providedState,
        dispatch
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
