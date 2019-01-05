import React, { useEffect, useContext, useState } from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState } from "../context/GlobalState";
import { CherryContext } from "../context/Cherry";
import { useCurrentPr } from "../hooks/currentPr";
import { CloseBtn } from "./CloseBtn";

export const Files = () => {
	const cherry = useContext(CherryContext);
	const { slices, removeSlice } = useSlices();
	const [route, setRoute] = useGlobalState("route");

  if(!cherry) {
		return <div />
	}
  const {pr} = useCurrentPr();
  if (!pr) {
    return <div>Pull request no loaded yet</div>;
  }

  return (
    <div>
      <div className="Box-header">
        <h3 className="Box-title">REVIEW SELECTED FILES</h3>
      </div>

      <div className="Box-body">
        <p>
          <span className="mr-1">Review {slices.length} files selected from {pr.head.ref}</span>
        </p>
      </div>
      <div
        style={{ maxHeight: "300px" }}
        className="Box overflow-auto"
      >
        {slices &&
          slices.map((filename, index) => (
            <div key={index+"-file"}className="Box-row .Box-row--hover-blue d-flex flex-items-center">
              <div className="flex-auto ">
                <div className="float-left m-1 mr-2"><FileIcon /></div>
                {filename}
              </div>
			  <div style={{cursor:"pointer"}}  onClick={()=>removeSlice(filename)}><TrashIcon /></div>
            </div>
          ))}
      </div>

      <div className="Box-footer text-right">
      
        <CloseBtn label="Cancel" />
		<button
          onClick={() => {
			  setRoute("/review")}}
          type="button"
          className="btn btn-primary"
          autoFocus
        >
          Continue
        </button>
      </div>
    </div>
  );
};


const FileIcon = () =>{
	return <svg height="16" width="16" className="octicon octicon-file d-block mx-auto" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>
}

const TrashIcon = () => {
	return <svg height="16" width="16" className="octicon octicon-trashcan d-block mx-auto" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"></path></svg>
}