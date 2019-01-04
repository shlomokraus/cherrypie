import { jsx } from "@emotion/core";

import React, { useReducer, useEffect, useContext } from "react";
import { useStorage } from "../hooks/storage";
import { useLogin } from "../hooks/login";
import { ProcessStatus } from "../constants";
import { useGlobalState } from '../context/GlobalState';
import { useAuth } from "../hooks/auth";

export const Login = () => {
  const { login, status, error } = useLogin();
  const [auth] = useAuth();
  const { authMethod, token, username, password } = auth;
  const [route, setRoute] = useGlobalState("route");
  
  const [form, updateForm] = useReducer((state, action) => {
    switch (action.field) {
      case "token":
        return { ...state, token: action.value };
      case "username":
        return { ...state, username: action.value };
      case "password":
        return { ...state, password: action.value };
      case "authMethod":
        return { ...state, authMethod: action.value };
      default:
        return state;
    }
  }, {
    username: auth.username,
    password: auth.password,
    token: auth.token,
    authMethod: auth.authMethod
  });

  useEffect(()=>{
    if(status===ProcessStatus.Done){
      onNext();
    } 
    // TODO: Handle errors if they are not auth based
  }, [status]);

  const onLogin = async () => {
    let payload = { authMethod: form.authMethod, save: true } as any;

    switch (form.authMethod) {
      case "password":
        payload = {
          username: form.username || auth.username,
          password: form.password || auth.password
        };
        break;
      case "token":
        payload = { token: form.token || auth.token };
        break;
    }

    login(payload);
  };

  const onNext = () => {
    setRoute("/files");
  }
  const getSubmitEnabled = () => {
    switch (form.authMethod) {
      case "password":
        return (
          (form.username && form.password) || (auth.username && auth.password)
        );

      case "token":
        return form.token || auth.token;
    }
  };

  return (
    <div>
      <div className="Box-header">
        <h3 className="Box-title">Setup Cherry Pie</h3>
      </div>
      <RenderStatus status={status} error={error} />
      <div className="Box-body ">
        <h3 className="f1-light text-center ">Authentication</h3>
        <form>
          <dl className="form-group">
            <dt>
              <label htmlFor="example-select">Authentication method</label>
            </dt>
            <dd>
              <select
                className="form-select   input-block"
                id="example-select"
                onChange={e => {
                  e.target.value &&
                    updateForm({ field: "authMethod", value: e.target.value })
                }}
                value={authMethod}
              >
                <option value="password">Password</option>
                <option value="token">Token</option>
              </select>
            </dd>
          </dl>

          {authMethod === "password" ? (
            <>
              <dl className="form-group">
                <dt>
                  <label htmlFor="example-text">Login</label>
                </dt>
                <dd>
                  <input
                    className="form-control  input-block"
                    type="text"
                    value={form.username}
                    defaultValue={username}
                    onChange={e =>
                      updateForm({ field: "username", value: e.target.value })
                    }
                  />
                </dd>
              </dl>
              <dl className="form-group">
                <dt>
                  <label htmlFor="example-text">Password</label>
                </dt>
                <dd>
                  <input
                    className="form-control  input-block"
                    type="password"
                    value={form.password}
                    defaultValue={password}
                    onChange={e =>
                      updateForm({ field: "password", value: e.target.value })
                    }
                  />
                </dd>
              </dl>
            </>
          ) : (
            ""
          )}

          {authMethod === "token" ? (
            <>
              <dl className="form-group">
                <dt>
                  <label htmlFor="example-text">Token</label>
                </dt>
                <dd>
                  <input
                    className="form-control  input-block"
                    type="text"
                    value={form.token}
                    defaultValue={token}
                    onChange={e =>
                      updateForm({ field: "token", value: e.target.value })
                    }
                  />
                </dd>
              </dl>
            </>
          ) : (
            ""
          )}
        </form>
      </div>
      <div className="Box-footer text-right">
        <button type="button" className="btn btn-secondary mr-2" data-close-dialog>
          Cancel
        </button>
        <ActionButton
          status={status}
          disabled={!getSubmitEnabled()}
          onLogin={onLogin}
          onNext={onNext}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ status, onLogin, onNext, disabled }) => {
  if (status === ProcessStatus.Done) {
    return <button
      onClick={onNext}
      type="button"
      className="btn btn-primary"
      autoFocus
    >
      Continue
    </button>;
  } else {
    return <button
      disabled={disabled}
      onClick={onLogin}
      type="button"
      className="btn btn-primary"
      autoFocus
    >
      Authenticate
    </button>;
  }
};


const ErrorMessage = ({ error }) => {
  error = error ? error : "Unknown Error";
  return <div className="flash flash-full flash-error">Login failed: {error}</div>;
};
const SuccessMessage = () => {
  return <div className="flash flash-full flash-success">Login successful</div>;
};
const WorkingMessage = () => {
  return (
    <div className="flash flash-full">Please wait while authenticating...</div>
  );
};
const RenderStatus = ({ status, error }) => {
  switch (status) {
    case ProcessStatus.Working:
      return <WorkingMessage />;
    case ProcessStatus.Done:
      return <SuccessMessage />;
    case ProcessStatus.Failed:
      return <ErrorMessage error={error} />;
    default:
      return <div />;
  }
};