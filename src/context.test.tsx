import { Store } from './context';
import { createState } from './reducers';
import { State, Action } from './types';

describe('Store', () => {
  it('can store state', () => {
    function reducer(state: State, action: Action) {
      if (action.type === 'COUNTING') {
        return state.update('counter', value => value + 1);
      }
      return state;
    }

    const store = new Store(createState({ counter: 1 }), reducer);

    expect(store.getState().get('counter')).toBe(1);

    store.dispatch({ type: 'COUNTING' });

    expect(store.getState().get('counter')).toBe(2);
  });
});
