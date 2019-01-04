import React, { useState, useEffect, useContext } from "react";
import { CherryPieService } from "../service/CherryPie";
import { GithubService } from "../service/Github";
import { useGlobalStore, dispatch} from "./GlobalStore";
import { useWindowLocation } from "../hooks/windowLocation";
export const CherryContext = React.createContext();

/**
 * Parse url and initialize github service and cherry.
 * Execute on every location change but only initialize if this is a pull request page. 
 */
const useCherryClient = (config?: { owner: string, repo: string, number: number}) => {
  const [cherry, setCherry] = useState();
  const location = useWindowLocation();
 
  // Construct client
  useEffect(
    () => {
      if(!config) {
         config = CherryPieService.parsePrUrl(location);
        if (!config) {
          setCherry(undefined);
        }
      }
    
      const github = new GithubService({ ...config, refPrefix: "heads" } as any);
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
  const config = props.config;
  const client = useCherryClient(config);
  return (
    <CherryContext.Provider value={client}>
      {props.children}
    </CherryContext.Provider>
  );
};
