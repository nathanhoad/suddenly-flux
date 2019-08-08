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

You can then use this new reducer as `Context` state in a `Provider`.

### Context

Use the `Provider` at the top level of your app to provide state.

In your `App.tsx` for example:

```tsx
import { Provider } from '@suddenly/flux';
import reducer from '../reducers';

export default (props: Props) => {
  return <Provider reducer={reducer}>...</Provider>;
};
```

This will automatically create a store and establish the initial state from the reducer.

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
