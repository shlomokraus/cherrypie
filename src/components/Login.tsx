import { jsx } from "@emotion/core";

import React, { useReducer, useEffect, useContext, useRef } from "react";
import { useStorage } from "../hooks/storage";
import { useLogin } from "../hooks/login";
import { ProcessStatus } from "../constants";
import { useGlobalState } from "../context/GlobalState";
import { useAuth } from "../hooks/auth";
import { CloseBtn } from "./CloseBtn";
import CherryLogo from "../../assets/logo.svg";
import { Formik, Form, Field } from "formik";

const validate = values => {
  let errors: any = {};
  if (values.authMethod === "token" && !values.token) {
    errors.token = "Required";
  } else if (values.authMethod === "password") {
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    }
  }

  return errors as any;
};

export const Login = () => {
  const { login, status, error } = useLogin();
  const [auth] = useAuth();
  const [route, setRoute] = useGlobalState("route");
  const initialValues = { ...auth, authMethod: "password", save: true };
  useEffect(
    () => {
      if (status === ProcessStatus.Done) {
        onNext();
      }
      // TODO: Handle errors if they are not auth based
    },
    [status]
  );

  const onLogin = async values => {
    let payload = values;
    switch (values.authMethod) {
      case "password":
        payload = {
          ...payload,
          username: values.username || auth.username,
          password: values.password || auth.password
        };
        break;
      case "token":
        payload = { ...payload, token: values.token || auth.token };
        break;
    }

    login(payload);
  };

  const onNext = () => {
    setRoute("/files");
  };

  return (
    <div>
      <Formik
        validateOnChange={false}
        validate={validate}
        initialValues={initialValues}
        onSubmit={onLogin}
        enableReinitialize={true}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset
          } = props;
          const { authMethod, username, password, token, save } = values;
          return (
            <>
              <div className="Box-header">
                <h3 className="Box-title">CHERRY PIE - SETUP</h3>
              </div>
              <RenderStatus status={status} error={error} />
              <Form>
                <div className="Box-body ">
                  <AuthenticationHeader />

                  <dl className="form-group">
                    <dt>
                      <label htmlFor="example-select">
                        Authentication method
                      </label>
                    </dt>
                    <dd>
                      <select
                        className="form-select   input-block"
                        id="authMethod"
                        onChange={handleChange}
                        value={authMethod}
                      >
                        <option value="password">Password</option>
                        <option value="token">Personal Access Token</option>
                      </select>
                    </dd>
                  </dl>

                  {authMethod === "password" && <PasswordForm {...props} />}

                  {authMethod === "token" && <TokenForm {...props} />}

                  <div className="form-checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={save}
                        onChange={handleChange}
                      />
                      <em className="highlight">Save credentials</em>
                    </label>
                  </div>
                </div>

                <div className="Box-footer text-right">
                  <CloseBtn label={"Cancel"} />
                  <ActionButton
                    status={status}
                    onLogin={handleChange}
                    onNext={onNext}
                  />
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

const PasswordForm = ({ errors, handleChange, values }) => (
  <>
    <dl className={"form-group" + (errors.username ? " errored" : "")}>
      <dt>
        <label htmlFor="example-text">Login</label>
      </dt>
      <dd>
        <input
          aria-describedby="form-error-text"
          name="username"
          value={values.username}
          onChange={handleChange}
          className="form-control"
          type="text"
        />
      </dd>
      <dd className="error" id="form-error-text">
        {errors.username}
      </dd>
    </dl>
    <dl className={"form-group" + (errors.password ? " errored" : "")}>
      <dt>
        <label htmlFor="example-text">Password</label>
      </dt>
      <dd>
        <input
          aria-describedby="form-error-text"
          name="password"
          value={values.password}
          onChange={handleChange}
          className="form-control"
          type="password"
        />
      </dd>
      <dd className="error" id="form-error-text">
        {errors.password}
      </dd>
    </dl>
  </>
);

const TokenForm = ({ errors, values, handleChange }) => (
  <>
    <dl className={"form-group" + (errors.token ? " errored" : "")}>
      <dt>
        <label htmlFor="example-text">Token</label>
      </dt>
      <dd>
        <input
          aria-describedby="form-error-text"
          name="token"
          value={values.token}
          onChange={handleChange}
          className="form-control"
          type="text"
        />
      </dd>
      <dd className="error" id="form-error-text">
        {errors.password}
      </dd>
     
    </dl>
  </>
);

const AuthenticationHeader = () => (
  <>
    <div
      css={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <img css={{ width: "250px" }} src={CherryLogo} />
    </div>
    <h3 css={{ marginBottom: "20px" }} className="f1-light text-center ">
      Authentication
    </h3>
  </>
);

const ActionButton = ({ status, onLogin, onNext, disabled }) => {
  if (status === ProcessStatus.Done) {
    return (
      <button
        onClick={onNext}
        type="button"
        className="btn btn-primary"
        autoFocus
      >
        Continue
      </button>
    );
  } else {
    return (
      <button
        disabled={disabled}
        type="submit"
        className="btn btn-primary"
        autoFocus
      >
        Authenticate
      </button>
    );
  }
};

const ErrorMessage = ({ error }) => {
  error = error ? error : "Unknown Error";
  return (
    <div className="flash flash-full flash-error">Login failed: {error}</div>
  );
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
