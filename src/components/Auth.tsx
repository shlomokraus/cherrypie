import React, { useState, useEffect, useContext } from "react";
import { useStorage } from "../hooks/storage";
import { useLogin } from "../hooks/login";

export const AuthLoader = props => {
  const [authDone, setAuthDone] = useState(false);
  const [auth, setAuth, loaded] = useStorage("auth", {
    authMethod: "password"
  });
  const { login } = useLogin();

  useEffect(
     () => {
      if (loaded) {
        try {
          if (validateAuth(auth)) {
            login(auth).then(()=>setAuthDone(true)).catch(()=>setAuthDone(true));
          }
        } finally {
            setAuthDone(true);
        }
      }
    },
    [loaded]
  );

  if(authDone){
      return <>{props.children}</>
  } else {
      return <div />
  }

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
