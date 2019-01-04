import { useState, useEffect, useContext, useCallback } from "react";
import { CherryContext } from "../context/Cherry";
import { ProcessStatus } from "../constants";
import { useGlobalState } from "../context/GlobalState";
import { useAuth } from "../hooks/auth";

export const useLogin = () => {
  const [status, setStatus] = useGlobalState("initStatus");
  const [error, setError] = useGlobalState("initError");
  const cherry = useContext(CherryContext);
  const [auth, setAuth] = useAuth();

  const login = async (params: {
    username?: string;
    password?: string;
    token?: string;
    authMethod: string;
    save?: boolean;
  }) => {
    if (!cherry) {
      throw Error("Missing Cherry service in context");
    }
    setStatus(ProcessStatus.Working);
    try {
      await cherry.init(params);
      setStatus(ProcessStatus.Done);
      if (params.save) {
        setAuth({
          ...auth,
          username: params.username,
          password: params.password,
          token: params.token
        });
      }
      return true;
    } catch (ex) {
      console.log("Init error", ex.message);
      setStatus(ProcessStatus.Failed);
      setError(ex.message);
      return false;
    }
  };

  return { login: useCallback(login, [cherry]), status, error };
};
