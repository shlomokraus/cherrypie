import React, { useState, useEffect, useContext } from "react";
import { useStorage } from "../hooks/storage";
import { useLogin } from "../hooks/login";

export const AuthContext = React.createContext();

export const AuthProvider = props => {
  const [authDone, setAuthDone] = useState(false);
  const [auth, setAuth, loaded] = useStorage("auth", {
    authMethod: "password"
  });
  const { login } = useLogin();

  useEffect(
    async () => {
      if (loaded) {
          console.log("Auth is", auth);
        try {
          if (validateAuth(auth)) {
            await login(auth);
          }
        } finally {
            setAuthDone(true);
        }
      }
    },
    [loaded]
  );

  return (
    <AuthContext.Provider value={authDone}>
      {props.children}
    </AuthContext.Provider>
  );
};

const validateAuth = ({ authMethod, token, username, password }) => {
  if (authMethod === "password") {
    return username && password;
  } else if (authMethod === "token") {
    return token;
  } else {
    return false;
  }
};
