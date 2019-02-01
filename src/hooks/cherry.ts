import { useState, useEffect, useContext } from "react";
import { CherryContext } from "../context/Cherry";
import { dispatch } from "../context/GlobalStore";
import { ProcessStatus } from "../constants";

export const useSlice =  () => {
  const cherry = useContext(CherryContext);
  const [status, setStatus] = useState(ProcessStatus.Idle);
  const [error, setError] = useState();

  const slice = async ({paths, sourceBranch, targetBranch, baseBranch, createPr, prTitle, prBody, message}) =>{
    try {
        dispatch({type: "clear-messages"})
        setStatus(ProcessStatus.Working);
        await cherry.slice({
            paths,
            sourceBranch,
            targetBranch,
            baseBranch,
            message,
            createPr, 
            prBody,
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