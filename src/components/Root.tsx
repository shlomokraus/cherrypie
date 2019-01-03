import { Route, Switch } from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState, InitStatus } from "../context/GlobalState";
import { useStorage } from '../hooks/storage';
import { Routes } from "./Routes";

export const Root = () => {
  const { slices } = useSlices();
 
  return (
    slices.length > 0 ? <details className="details-reset details-overlay details-overlay-dark">
      <summary className="btn btn-sm  btn-purple" aria-haspopup="dialog">
        Cherry Slice
        <span className="ml-2">{slices.length}</span>
      </summary>
      <details-dialog className="Box Box--overlay d-flex flex-column anim-fade-in fast">
			<div style={{zIndex:10000, backgroundColor: "white"}}><Routes /></div>
      </details-dialog>
    </details> : ""
  );
};
