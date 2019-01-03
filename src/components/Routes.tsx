import React, { useContext } from "react";
import { useGlobalState } from "../context/GlobalState";
import { Files } from "../components/Files";
import { Review } from "../components/Review";
import { Login } from "../components/Login";
import { Execute } from "../components/Execute";
export const Routes = () => {
  const [route] = useGlobalState("route");

  switch (route) {
    case "/files":
      return <Files />;
    case "/review":
      return <Review />;
    case "/login":
      return <Login />;
    case "/execute":
      return <Execute />;
    case "/error":
      return <div>Initialize error</div>
    default:
      return <div>404 {route}</div>;
  }
};
