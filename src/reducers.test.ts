import { createState, createReducer, combineReducers } from "./reducers";
import { State } from "./types";

describe("Reducers", () => {
  it("can create state from a keyed array", () => {
    const list = [
      { slug: "first", value: "the first one" },
      { slug: "second", value: "another one" },
      { slug: "third", value: "Yet another one" }
    ];
    const state = createState(list, "slug");

    expect(state.getIn(["first", "value"])).toBe(list[0].value);
    expect(state.getIn(["second", "value"])).toBe(list[1].value);
    expect(state.getIn(["third", "value"])).toBe(list[2].value);
  });

  it("will not try and key an object", () => {
    const list = {
      first: { slug: "first", value: "the first one" },
      second: { slug: "second", value: "another one" },
      third: { slug: "third", value: "Yet another one" }
    };
    const state = createState(list, "slug");

    expect(state.getIn(["first", "value"])).toBe(list.first.value);
    expect(state.getIn(["second", "value"])).toBe(list.second.value);
    expect(state.getIn(["third", "value"])).toBe(list.third.value);
  });

  it("can create a basic reducer", () => {
    const initialState = createState({
      isLoading: false,
      value: null
    });

    const reducer = createReducer(initialState, {
      IS_LOADING(state, action) {
        return state.set("isLoading", true);
      },
      HAS_LOADED(state, action) {
        state = state.set("isLoading", false);
        state = state.set("value", action.payload);
        return state;
      }
    });

    let state = reducer();

    expect(state.get("isLoading")).toBe(false);

    state = reducer(state, { type: "IS_LOADING" });

    expect(state.get("isLoading")).toBe(true);

    state = reducer(state, { type: "HAS_LOADED", payload: "Hello" });

    expect(state.get("isLoading")).toBe(false);
    expect(state.get("value")).toBe("Hello");
  });

  it("can run a side effect", () => {
    const initialState = createState({
      key: "value"
    });

    const sideEffect = jest.fn();

    const reducer = createReducer(
      initialState,
      {
        CHANGING_VALUE(state, action) {
          return state.set("key", "new value");
        }
      },
      sideEffect
    );

    const state = reducer(initialState, { type: "CHANGING_VALUE" });
    expect(sideEffect).toBeCalledWith(state);
  });

  it("can combine reducers", () => {
    const initialFirstState = createState({
      value: null
    });

    const first = createReducer(initialFirstState, {
      FIRST_VALUE(state, action) {
        return state.set("value", action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set("value", action.payload);
      }
    });

    const initialSecondState = createState({
      value: null
    });

    const second = createReducer(initialSecondState, {
      SECOND_VALUE(state, action) {
        return state.set("value", action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set("value", action.payload);
      }
    });

    const reducer = combineReducers({ first, second });

    let state = reducer();

    expect(state.getIn(["first", "value"])).toBe(null);
    expect(state.getIn(["second", "value"])).toBe(null);

    state = reducer(state, { type: "FIRST_VALUE", payload: "First" });

    expect(state.getIn(["first", "value"])).toBe("First");
    expect(state.getIn(["second", "value"])).toBe(null);

    state = reducer(state, { type: "SECOND_VALUE", payload: "Second" });

    expect(state.getIn(["first", "value"])).toBe("First");
    expect(state.getIn(["second", "value"])).toBe("Second");

    state = reducer(state, { type: "BOTH_VALUE", payload: "BOTH" });

    expect(state.getIn(["first", "value"])).toBe("BOTH");
    expect(state.getIn(["second", "value"])).toBe("BOTH");
  });

  it("can run a side effect with combined reducers", () => {
    const initialFirstState = createState({
      value: null
    });

    const first = createReducer(initialFirstState, {
      FIRST_VALUE(state, action) {
        return state.set("value", action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set("value", action.payload);
      }
    });

    const initialSecondState = createState({
      value: null
    });

    const second = createReducer(initialSecondState, {
      SECOND_VALUE(state, action) {
        return state.set("value", action.payload);
      },
      BOTH_VALUE(state, action) {
        return state.set("value", action.payload);
      }
    });

    const sideEffect = jest.fn();

    const reducer = combineReducers({ first, second }, sideEffect);

    let state = reducer();
    state = reducer(state, { type: "FIRST_VALUE", payload: "First" });

    expect(sideEffect).toBeCalledWith(state);
  });
});
