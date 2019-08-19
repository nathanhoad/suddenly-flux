# @suddenly/flux

A simple implementation of Flux that is loosely based on Redux.

## Usage

### Reducers

Reducers work similar to Redux but utilise [Immutable.js](https://immutable-js.github.io/immutable-js/docs/#/) by default.

```ts
import { createState, createReducer } from '@suddenly/flux';
import ItemActions from '../actions/ItemActions';

// createState is a convenience wrapper for Immutable.fromJS()
const initialState = createState({
  isLoading: false,
  all: []
});

export default createReducer(initialState, {
  [ItemActions.LOADING_ITEMS](state, action) {
    return state.set('isLoading', true);
  },

  [ItemActions.LOADED_ITEMS](state, action) {
    return state.merge({
      isLoading: false,
      all: createState(action.payload)
    });
  }
});
```

You can also pass an optional `sideEffect` function as the third argument to `createReducer` that will be called (passing the updated state) once all reducer functions are called.

And then you might combine your reducers:

```ts
import { combineReducers } from '@suddenly/flux';

import Items from './ItemReducer';
import Other from './OtherReducer';

export default combineReducer({
  Items,
  Other
});
```

This will create a tree structure with each reducer managing the state under the same key in the store.

In this example, the store would look something like:

```js
{
  Items: {
    isLoading: false,
    all: []
  },
  Other: {
    ...
  }
}
```

You can also pass a `sideEffect` function as the second argument to `combineReducers`. This function will be called with the updated state once all reducers are run.

You can then use this new reducer as context state in a `Provider`.

### Context

First, create a store:

```ts
import { Store, createState } from '@suddenly/flux';
import reducer from './reducers';

const initialState = createState({
  ...
});

export new Store(initialState, reducer);
```

Then create a `Provider` at the top level of your app to provide state.

For example, in your `App.tsx`:

```tsx
import { Provider } from '@suddenly/flux';
import store from '../store';

export default (props: Props) => {
  return <Provider store={store}>...</Provider>;
};
```

Then you can use `connect` to create a HOC that maps state and dispatch calls into the wrapped component.

```tsx
import { connect } from '@suddenly/flux';
import ItemActions from '../actions/ItemActions';

interface Props {
  //...
}

export const ItemList = (props: Props) {
  return (
    <div>
      {props.items.map(item => {
        return (
          <div>
            {item.get('label')}
            <button onClick={e => props.actionItem(item)}>Action</button>
          </div>
        )
      })}
    </div>
  );
}

function mapStateToProps (state, ownProps) {
  return {
    items: state.getIn(['Items', 'all'])
  };
}

function mapDispatchToProps (dispatch, ownProps) {
  return {
    actionItem(item) {
      dispatch(ItemActions.actionItem(item));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemList);
```

## Contributors

- Nathan Hoad - [nathan@nathanhoad.net](mailto:nathan@nathanhoad.net)
