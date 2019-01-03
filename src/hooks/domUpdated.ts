import { useEffect, useState } from "react";

export const useDomUpdated = ():MutationEvent => {
  const [nodes, setNodes] = useState(undefined);

  useEffect(() => {
    document.addEventListener("DOMNodeInserted", setNodes, false);
   
  }, []);

  return nodes;
};
