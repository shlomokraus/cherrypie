import { useState, useEffect, useContext } from "react";
import { CherryContext } from "../context/Cherry";
import { dispatch } from "../context/GlobalStore";
import { ProcessStatus } from "../constants";
/*
export const useCherry = () => {
  const cherry = useContext(CherryContext);
  const [initStatus, setInit] = useGlobalState("initStatus");

  const init = async ({username, password, token}: {username?: string, password?: string, token?: string}) => {
    try {
      setInit(InitStatus.Working);
      const payload = auth.authMethod==="password" ? { username: auth.login, password: auth.password } : {token: auth.token};
      await cherry.init(payload);
      setInit(InitStatus.Done);
    } catch (ex) {
      console.log("Init failed with message", ex.message);
      if(ex.message === "Bad credentials"){
        let payload = auth;
        if(auth.authMethod==="password"){
            delete payload.login
            delete payload.password
        } else if(auth.authMethod==="token"){
            delete payload.token
        }
        setAuth(payload);
        setInit(InitStatus.NoAuth);
      } else {
        setInit(InitStatus.Failed);
      }
    }
    return true;
  };

  return { init };
};
*/

export const useSlice =  () => {
  const cherry = useContext(CherryContext);
  const [status, setStatus] = useState(ProcessStatus.Idle);
  const [error, setError] = useState();

  const execute = async () => {
      // await setPage()

      
  }
  const slice = async ({paths, sourceBranch, targetBranch, baseBranch, createPr, prTitle}) =>{
    try {
        dispatch({type: "clear-messages"})
        setStatus(ProcessStatus.Working);
        await cherry.slice({
            paths,
            sourceBranch,
            targetBranch,
            baseBranch,
            createPr, 
            prTitle
          });
        setStatus(ProcessStatus.Done);
      } catch(ex){
        console.log("err", ex);
        setError(ex.message);
        setStatus(ProcessStatus.Failed);
      }
  }

  return { slice, status, error }
 
}