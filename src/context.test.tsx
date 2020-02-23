import * as React from "react";
import { render, fireEvent } from "@testing-library/react";

import { Store, Provider, connect } from "./context";
import { createState } from "./reducers";
import { State, Action, Dispatch } from "./types";

describe("Context", () => {
  describe("Store", () => {
    it("can store state", () => {
      function reducer(state: State, action: Action) {
        if (action.type === "COUNTING") {
          return state.update("counter", value => value + 1);
        }
        return state;
      }

      const store = new Store(createState({ counter: 1 }), reducer);
      expect(store.getState().get("counter")).toBe(1);

      store.dispatch({ type: "COUNTING" });
      expect(store.getState().get("counter")).toBe(2);

      function action() {
        return (dispatch: Dispatch, getState: () => State) => {
          expect(getState().get("counter")).toBe(2);
          dispatch({ type: "COUNTING" });
          expect(getState().get("counter")).toBe(3);
        };
      }

      store.dispatch(action());
      expect(store.getState().get("counter")).toBe(3);
    });

    it("defers to the reducer when given null intial state", () => {
      function reducer(state: State = createState({ counter: 1 }), action: Action) {
        if (action && action.type === "COUNTING") {
          return state.update("counter", value => value + 1);
        }
        return state;
      }

      const store = new Store(null, reducer);
      expect(store.getState().get("counter")).toBe(1);

      store.dispatch({ type: "COUNTING" });
      expect(store.getState().get("counter")).toBe(2);
    });
  });

  describe("<Provider />", () => {
    it("can provide context to connected components", () => {
      function reducer(state: State, action: Action) {
        if (action && action.type === "change") {
          return createState({
            message: "changed!"
          });
        } else {
          return createState({
            message: "hello"
          });
        }
      }

      function Component(props: { message: string; change: () => void }) {
        return (
          <div>
            <span data-testid="message">{props.message}</span>
            <button data-testid="button" onClick={() => props.change()}>
              Change!
            </button>
          </div>
        );
      }

      function mapState(state: State) {
        return {
          message: state.get("message")
        };
      }

      function mapDispatch(dispatch: Dispatch) {
        return {
          change() {
            dispatch({ type: "change" });
          }
        };
      }

      const ConnectedComponent = connect(mapState, mapDispatch)(Component);

      const { getByTestId, rerender } = render(
        <Provider reducer={reducer}>
          <ConnectedComponent />
        </Provider>
      );

      expect(getByTestId("message").innerHTML).toContain("hello");

      fireEvent.click(getByTestId("button"));

      rerender(
        <Provider reducer={reducer}>
          <ConnectedComponent />
        </Provider>
      );

      expect(getByTestId("message").innerHTML).toContain("changed!");
    });
  });
});
