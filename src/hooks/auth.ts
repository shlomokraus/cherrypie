import { useState } from "react";
import { useStorage } from "./storage";

export const useAuth = () => {
  const [auth, setAuth, loaded] = useStorage("auth", {
    authMethod: "password"
  });

  const valid = validateAuth(auth);

  return [auth, setAuth, loaded, valid];
};

export const validateAuth = ({ authMethod, token, username, password }) => {
    if (authMethod === "password") {
      return username && password;
    } else if (authMethod === "token") {
      return token;
    } else {
      return false;
    }
};
  