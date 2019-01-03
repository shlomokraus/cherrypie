import { Route, Switch } from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState, InitStatus } from "../context/GlobalState";
import { useStorage } from '../hooks/storage';
import { Routes } from "./Routes";

export const Root = () => {
  const { slices } = useSlices();
 
  return (
    slices.length > 0 ? <details class="details-reset details-overlay details-overlay-dark">
      <summary class="btn btn-sm  btn-purple" aria-haspopup="dialog">
        Cherry Slice
        <span class="ml-2">{slices.length}</span>
      </summary>
      <details-dialog class="Box Box--overlay d-flex flex-column anim-fade-in fast">
			<Routes />
      </details-dialog>
    </details> : ""
  );
};
