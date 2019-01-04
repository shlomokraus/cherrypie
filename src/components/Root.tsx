import { Route, Switch } from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState, InitStatus } from "../context/GlobalState";
import { useStorage } from '../hooks/storage';
import { Routes } from "./Routes";
import "details-dialog-element";

export const Root = () => {
  const { slices } = useSlices();
 
  return (
    true ? <details className="details-reset details-with-dialog mt-4">
      <summary className="btn btn-sm  btn-purple" aria-haspopup="dialog">
        Cherry Slice
        <span className="ml-2">{slices.length}</span>
      </summary>
      <details-dialog className="details-dialog  anim-fade-in fast narrow" role="dialog">
			<div className="Box d-flex flex-column" ><Routes /></div>
      </details-dialog>
    </details> : ""
  );
};
