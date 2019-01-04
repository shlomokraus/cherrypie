import React, { useEffect, useContext } from "react";
import { CherryProvider, CherryContext } from "../context/Cherry";
import { GlobalStateProvider } from "../context/GlobalState";
import { Root } from "./Root";
import { GlobalStoreProvider } from "../context/GlobalStore";
import { useSlices } from "../hooks/slices";
import { useAuth } from "../hooks/auth";
import { useLogin } from "../hooks/login";
import { useCurrentPr } from "../hooks/currentPr";

/**
 * Listen to events coming in from external components 
 */
export const useEmitter = emitter => {
  const { addSlice } = useSlices();
  useEffect(
    () => {
      emitter.on("file-slice", filename => {
        console.log(filename);
        addSlice(filename);
      });
    },
    [emitter]
  );
};

/**
 * Initialize the app by authenticating if payload exists
 */
export const useInit = () => {
  const cherry = useContext(CherryContext);
  const [auth, setAuth, loaded, valid] = useAuth();
  const { login } = useLogin();
  useEffect(
    () => {
      if (loaded && cherry && valid) {
        login(auth);
      }
    },
    [cherry, loaded]
  );
}

export const Container = props => {
  return (
    <GlobalStoreProvider>
      <GlobalStateProvider>
        <CherryProvider config={props.config}>{props.children}</CherryProvider>
      </GlobalStateProvider>
    </GlobalStoreProvider>
  );
};

export function AppContent({ emitter }) {
  useEmitter(emitter);
  useInit();
  useCurrentPr();
  return <Root />;
}

export const App = props => {
  return (
    <Container {...props}>
      <AppContent {...props} />
    </Container>
  );
};
