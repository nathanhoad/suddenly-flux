import { Store } from './context';
import { createState } from './reducers';

describe('Store', () => {
  it('can store state', () => {
    const store = new Store(createState({ property: 'value' }));

    let state = store.getState();

    expect(state.get('property')).toBe('value');

    state = state.set('other', 'thing');

    store.mergeState(state);

    expect(store.getState().get('other')).toBe('thing');
  });
});
