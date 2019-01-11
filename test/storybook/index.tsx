import React from "react";
import { storiesOf } from "@storybook/react";
import { Button } from "@storybook/react/demo";
import { Login } from "../../src/components/Login";
import { Files } from "../../src/components/Files";
import { Review } from "../../src/components/Review";
import { CherryProvider, CherryContext } from "../../src/context/Cherry";
import {
  GlobalStateProvider,
  useGlobalState
} from "../../src/context/GlobalState";
import { GlobalStoreProvider } from "../../src/context/GlobalStore";
import { PrContext } from "../../src/context/PullRequest";

import { GetPullsResponseMock } from "../mocks/pr";

const AppWrapper = props => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <div
        className="Box d-flex flex-column"
        style={{ width: "450px", marginTop: "50px" }}
      >
        <GlobalStoreProvider>
          <GlobalStateProvider>
            <CherryProvider>
              <PrContext.Provider value={{ pr: GetPullsResponseMock }}>
                {props.children}
              </PrContext.Provider>
            </CherryProvider>
          </GlobalStateProvider>
        </GlobalStoreProvider>
      </div>
    </div>
  );
};
storiesOf("Authentication Page", module).add("Default", () => (
  <AppWrapper>
    {" "}
    <Login />
  </AppWrapper>
));

storiesOf("Files Page", module).add("Default", () => (
  <AppWrapper>
    {" "}
    <Files />
  </AppWrapper>
));

storiesOf("Review Page", module).add("Default", () => (
  <AppWrapper>
    {" "}
    <Review />
  </AppWrapper>
));
