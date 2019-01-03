import React, { useEffect, useContext, useState } from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState } from "../context/GlobalState";
import { useRouter } from "../hooks/router";
import { CherryContext } from "../context/Cherry";

export const Files = () => {
	const cherry = useContext(CherryContext);
	const { slices, removeSlice } = useSlices();
	const [route, setRoute] = useGlobalState("route");
	console.log(slices, removeSlice);
	if(!cherry) {
		return <div />
	}
  const pr = cherry.pr();
  if (!pr) {
    return <div>Pull request no loaded</div>;
  }

  return (
    <div>
      <div class="Box-header">
        <h3 class="Box-title">Selected files</h3>
      </div>

      <div class="Box-body">
        <p>
          <span className="mr-1">Review {slices.length} files selected from {pr.head.ref}</span>
        </p>
      </div>
      <div
        style={{ maxHeight: "300px" }}
        class="Box overflow-auto"
      >
        {slices &&
          slices.map(filename => (
            <div class="Box-row .Box-row--hover-blue d-flex flex-items-center">
              <div class="flex-auto ">
                <div class="float-left m-1 mr-2"><FileIcon /></div>
                {filename}
              </div>
			  <div style={{cursor:"pointer"}}  onClick={()=>removeSlice(filename)}><TrashIcon /></div>
            </div>
          ))}
      </div>

      <div class="Box-footer text-right">
      
        <button
          type="button"
          class="btn  mr-2"
          data-close-dialog
        >
          Cancel
        </button>
		<button
          onClick={() => {
			  setRoute("/review")}}
          type="button"
          class="btn btn-primary"
          autofocus
        >
          Continue
        </button>
      </div>
    </div>
  );
};


const FileIcon = () =>{
	return <svg height="16" width="16" class="octicon octicon-file d-block mx-auto" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
}

const TrashIcon = () => {
	return <svg height="16" width="16" class="octicon octicon-trashcan d-block mx-auto" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
}