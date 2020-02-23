import { useContext } from "react";
import { Context } from "./context";
import { SelectorFunction } from "./types";

/**
 * Get some state out of the main state tree
 * @param selector A selector function to isolate state
 */
export function useSelector(selector: SelectorFunction) {
  const context: any = useContext(Context);

  return selector(context.state);
}

/**
 * Get a reference to dispatch()
 */
export function useDispatch() {
  const context: any = useContext(Context);

  return context.dispatch;
}
