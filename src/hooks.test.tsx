import * as React from "react";
import { render } from "@testing-library/react";

import { Context, createState } from ".";
import { useSelector, useDispatch } from "./hooks";
import { State } from "./types";

describe("Hooks", () => {
  describe("useSelector()", () => {
    it("can provide state", () => {
      expect.hasAssertions();

      function Component() {
        const state = useSelector((state: State) => state.get("first"));
        return <div data-testid="first">{state}</div>;
      }

      const state = createState({
        first: "actual value"
      });
      const dispatch = jest.fn();

      const { getByTestId } = render(
        <Context.Provider value={{ state, dispatch }}>
          <Component />
        </Context.Provider>
      );

      expect(getByTestId("first").innerHTML).toContain("actual value");
    });
  });

  describe("useDispatch()", () => {
    it("can dispatch actions", () => {
      expect.hasAssertions();

      function Component() {
        const d = useDispatch();
        React.useEffect(() => {
          d({ type: "test" });
        }, []);
        return <div>Nothing</div>;
      }

      const state = createState({ isTesting: true });
      const dispatch = jest.fn();

      render(
        <Context.Provider value={{ state, dispatch }}>
          <Component />
        </Context.Provider>
      );

      expect(dispatch).toHaveBeenCalled();
    });
  });
});
