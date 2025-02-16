import { createContext, useReducer } from "react";

const initState = {};

const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_XXX":
      return { ...state };
    default:
      return state;
  }
};

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider, GlobalContext };
