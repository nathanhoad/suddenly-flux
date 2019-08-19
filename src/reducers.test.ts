import { createState, createReducer, combineReducers } from './reducers';
import { State } from './types';

describe('Reducers', () => {
  it('can create a basic reducer', () => {
    const initialState = createState({
      isLoading: false,
      value: null
    });

    const reducer = createReducer(initialState, {
      IS_LOADING(state, action) {
        return state.set('isLoading', true);
      },
      HAS_LOADED(state, action) {
        state = state.set('isLoading', false);
        state = state.set('value', action.payload);
        return state;
      }
    });

    let state = reducer();

    expect(state.get('isLoading')).toBe(false);

    state = reducer(state, { type: 'IS_LOADING' });

    expect(state.get('isLoading')).toBe(true);

    state = reducer(state, { type: 'HAS_LOADED', payload: 'Hello' });

    expect(state.get('isLoading')).toBe(false);
    expect(state.get('value')).toBe('Hello');
  });

  it('can run a side effect', () => {
    const initialState = createState({
      key: 'value'
    });

    const sideEffect = jest.fn();

    const reducer = createReducer(
      initialState,
      {
        CHANGING_VALUE(state, action) {
          return state.set('key', 'new value');
        }
      },
      sideEffect
    );

    reducer(initialState, { type: 'CHANGING_VALUE' });

    expect(sideEffect).toBeCalled();
  });

  it('can combine reducers', () => {
    const initialFirstState = createState({
      value: null
    });

    const first = createReducer(initialFirstState, {
      FIRST_VALUE(state, action) {
        return state.set('value', action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set('value', action.payload);
      }
    });

    const initialSecondState = createState({
      value: null
    });

    const second = createReducer(initialSecondState, {
      SECOND_VALUE(state, action) {
        return state.set('value', action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set('value', action.payload);
      }
    });

    const reducer = combineReducers({ first, second });

    let state = reducer();

    expect(state.getIn(['first', 'value'])).toBe(null);
    expect(state.getIn(['second', 'value'])).toBe(null);

    state = reducer(state, { type: 'FIRST_VALUE', payload: 'First' });

    expect(state.getIn(['first', 'value'])).toBe('First');
    expect(state.getIn(['second', 'value'])).toBe(null);

    state = reducer(state, { type: 'SECOND_VALUE', payload: 'Second' });

    expect(state.getIn(['first', 'value'])).toBe('First');
    expect(state.getIn(['second', 'value'])).toBe('Second');

    state = reducer(state, { type: 'BOTH_VALUE', payload: 'BOTH' });

    expect(state.getIn(['first', 'value'])).toBe('BOTH');
    expect(state.getIn(['second', 'value'])).toBe('BOTH');
  });
});
