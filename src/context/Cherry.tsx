import React, { useState, useEffect, useContext } from "react";
import { CherryPieService } from "../service/CherryPie";
import { GithubService } from "../service/Github";
import { useGlobalStore, dispatch} from "./GlobalStore";
import { useWindowLocation } from "../hooks/windowLocation";
export const CherryContext = React.createContext();

const parsePrUrl = url => {
  let parsed = url.split("/");
  if (parsed[2] !== "github.com") {
    return false;
  }
  if (parsed[5] !== "pull") {
    return false;
  }

  return { owner: parsed[3], repo: parsed[4], number: parsed[6] };
};

/**
 * Parse url and initialize github service and cherry.
 * Execute on every location change but only initialize if this is a pull request page. 
 */
const useCherryClient = () => {
  const [cherry, setCherry] = useState();
  const location = useWindowLocation();

  useEffect(
    () => {
      const parsed = parsePrUrl(location);
      if (!parsed) {
        setCherry(undefined);
      }

      const github = new GithubService({ ...parsed, refPrefix: "heads" } as any);
      const cherryClient = new CherryPieService(github, {
        print: (message) => dispatch({type: "add-message", value: message})
      });

      setCherry(cherryClient);
    },
    [location]
  );

  return cherry;
};

export const CherryProvider = props => {
  const client = useCherryClient();
  return (
    <CherryContext.Provider value={client}>
      {props.children}
    </CherryContext.Provider>
  );
};
