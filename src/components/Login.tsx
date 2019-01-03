import { jsx } from "@emotion/core";

import React, { useReducer, useEffect, useContext } from "react";
import { useStorage } from "../hooks/storage";
import { useLogin } from "../hooks/login";
import { ProcessStatus } from "../constants";
import { useGlobalState } from '../context/GlobalState';
import { AuthContext} from "../context/Auth";
export const Login = () => {
  const { login, status, error } = useLogin();
  const { authMethod, token, username, password } = useContext(AuthContext);
  const [route, setRoute] = useGlobalState("route");

  const [form, updateForm] = useReducer((state, action) => {
    switch (action.field) {
      case "token":
        return { ...state, token: action.value };
      case "username":
        return { ...state, username: action.value };
      case "password":
        return { ...state, password: action.value };
      default:
        return state;
    }
  }, {});

  const onLogin = async () => {
    let payload;

    switch (authMethod) {
      case "password":
        payload = {
          username: form.username || auth.username,
          password: form.password || auth.password
        };
        setAuth({
          ...auth,
          authMethod: "password",
          ...payload
        });
        break;
      case "token":
        payload = { token: form.token || auth.token };
        setAuth({ ...auth, authMethod: "token", ...payload });
        break;
    }

    login(payload);
  };

  const onNext = () => {
    setRoute("/files");
  }
  const getSubmitEnabled = () => {
    switch (authMethod) {
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
      <div class="Box-header">
        <h3 class="Box-title">Setup Cherry Pie</h3>
      </div>
      <RenderStatus status={status} error={error} />
      <div class="Box-body ">
        <h3 class="f1-light text-center ">Authentication</h3>
        <form>
          <dl class="form-group">
            <dt>
              <label for="example-select">Authentication method</label>
            </dt>
            <dd>
              <select
                class="form-select   input-block"
                id="example-select"
                onChange={e => {
                  e.target.value &&
                    setAuth({ ...auth, authMethod: e.target.value });
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
              <dl class="form-group">
                <dt>
                  <label for="example-text">Login</label>
                </dt>
                <dd>
                  <input
                    class="form-control  input-block"
                    type="text"
                    value={form.username}
                    defaultValue={username}
                    onChange={e =>
                      updateForm({ field: "username", value: e.target.value })
                    }
                  />
                </dd>
              </dl>
              <dl class="form-group">
                <dt>
                  <label for="example-text">Password</label>
                </dt>
                <dd>
                  <input
                    class="form-control  input-block"
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
              <dl class="form-group">
                <dt>
                  <label for="example-text">Token</label>
                </dt>
                <dd>
                  <input
                    class="form-control  input-block"
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
      <div class="Box-footer text-right">
        <button type="button" class="btn btn-secondary mr-2" data-close-dialog>
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
      class="btn btn-primary"
      autofocus
    >
      Continue
    </button>;
  } else {
    return <button
      disabled={disabled}
      onClick={onLogin}
      type="button"
      class="btn btn-primary"
      autofocus
    >
      Authenticate
    </button>;
  }
};


const ErrorMessage = ({ error }) => {
  error = error ? error : "Unknown Error";
  return <div class="flash flash-full flash-error">Login failed: {error}</div>;
};
const SuccessMessage = () => {
  return <div class="flash flash-full flash-success">Login successful</div>;
};
const WorkingMessage = () => {
  return (
    <div class="flash flash-full">Please wait while authenticating...</div>
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