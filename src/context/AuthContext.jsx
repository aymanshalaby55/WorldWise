import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuth: false,
};


const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };
  

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    default:
      throw new Error("Unknown action type");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialState);

  function login(user) {
    if (user.email === FAKE_USER.email && user.password === FAKE_USER.password) {
      user = FAKE_USER;
    }

    dispatch({ type: "login", payload: user });
  }

  function logout() {
    
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext was used outside the AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
