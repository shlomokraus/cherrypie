import React, { useEffect, useContext, useState } from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState } from "../context/GlobalState";
import { CherryContext } from "../context/Cherry";
import shortid from "shortid";
import { useCurrentPr } from "../hooks/currentPr";

export const Review = () => {
  const cherry = useContext(CherryContext);
  const { slices, removeSlice } = useSlices();
  const [route, setRoute] = useGlobalState("route");
  const [target, setTarget] = useGlobalState("targetBranch");
  const [commitMessage, setCommitMessage] = useGlobalState("commitMessage");
  const [prTitle, setPrTitle] = useGlobalState("pullRequestTitle");

  const {pr} = useCurrentPr();
  if (!pr) {
   return <div>Pull request no loaded</div>;
  }

  const source = pr.head.ref;

  useEffect(
    () => {
      if (!target) {
        setTarget(source + "-" + shortid.generate());
      }
    },
    [source]
  );

  useEffect(
    () => {
      if (source) {
        setCommitMessage(
          `Adding ${slices.length} updates from branch ${source}`
        );
      }
    },
    [source, slices]
  );

  return (
    <div>
      <div className="Box-header">
        <h3 className="Box-title">REVIEW CHANGES</h3>
      </div>

      <div className="flash flash-full">
        {`You are about to slice ${slices.length} updates from ${source}`}
      </div>

      <div className="Box-body">
        <div className="Subhead" />
        <form>
          <dl className="form-group">
            <dt>
              <label htmlFor="example-text">Target branch</label>
              <p className="note" id="help-text-for-checkbox">
                <strong>warning:</strong> if branch exists, push will{" "}
                <strong>overwrite</strong> any other changes.
              </p>
            </dt>
            <dd>
              <input
                className="form-control"
                type="text"
                value={target}
                onChange={e => setTarget(e.target.value)}
                id="example-text"
              />
            </dd>
          </dl>
          <dl className="form-group">
            <dt>
              <label htmlFor="example-text">Commit message</label>
            </dt>
            <dd>
              <input
                className="form-control"
                type="text"
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                id="example-text"
              />
            </dd>
          </dl>
          <div className="Subhead Subhead--spacious">
            <div className="Subhead-heading">Pull Request</div>
          </div>
          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                checked="checked"
                aria-describedby="help-text-for-checkbox"
              />
              Open pull request after slice
            </label>
          </div>
          <input
            className="form-control input-block"
            type="text"
            placeholder="Pull request title"
            value={prTitle}
            onChange={e => setPrTitle(e.target.value)}
            id="example-text"
          />
        </form>
      </div>

      <div className="Box-footer text-right">
        <button type="button" className="btn  mr-2" data-close-dialog>
          Cancel
        </button>
        <button type="button" className="btn  mr-2" onClick={()=>setRoute("/files")}>
          Back
        </button>
        <button
          onClick={() => {
            setRoute("/execute");
          }}
          type="button"
          className="btn btn-primary"
          autoFocus
          disabled={!prTitle}
        >
          Slice!
        </button>
      </div>
    </div>
  );
};
