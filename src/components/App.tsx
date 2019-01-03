import React, { useEffect } from "react";
import { CherryProvider } from "../context/Cherry";
import { GlobalStateProvider } from "../context/GlobalState";
import { Root } from "./Root";
import { GlobalStoreProvider } from "../context/GlobalStore";
import { useSlices } from "../hooks/slices";
import { AuthLoader } from "./Auth";

export const useEmitter = emitter => {
  const { addSlice } = useSlices();
  useEffect(
    () => {
      emitter.on("file-slice", filename => {
        addSlice(filename);
      });
    },
    [emitter]
  );
};

export function AppContent(props) {
  const { emitter } = props;
  useEmitter(emitter);
  return <Root />;
}

export const Container = props => {
  return (
    <GlobalStoreProvider>
      <GlobalStateProvider>
        <CherryProvider>
          <AuthLoader>{props.children}</AuthLoader>
        </CherryProvider>
      </GlobalStateProvider>
    </GlobalStoreProvider>
  );
};

export const App = props => {
  return (
    <Container>
      <AppContent {...props} />
    </Container>
  );
};
