import React, { useEffect, useContext, useState } from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState } from "../context/GlobalState";
import { useRouter } from "../hooks/router";
import { CherryContext } from "../context/Cherry";
import shortid from "shortid";

export const Review = () => {
  const cherry = useContext(CherryContext);
  const { slices, removeSlice } = useSlices();
  const [route, setRoute] = useGlobalState("route");
  const [target, setTarget] = useGlobalState("targetBranch");
  const [commitMessage, setCommitMessage] = useGlobalState("commitMessage");
  const [prTitle, setPrTitle] = useGlobalState("pullRequestTitle");

  const pr = cherry.pr();
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
      <div class="Box-header">
        <h3 class="Box-title">Review changes</h3>
      </div>

      <div class="flash flash-full">
        {`You are about to slice ${slices.length} updates from ${source}`}
      </div>

      <div class="Box-body">
        <div class="Subhead" />
        <form>
          <dl class="form-group">
            <dt>
              <label for="example-text">Target branch</label>
              <p class="note" id="help-text-for-checkbox">
                <strong>warning:</strong> if branch exists, push will{" "}
                <strong>overwrite</strong> any other changes.
              </p>
            </dt>
            <dd>
              <input
                class="form-control"
                type="text"
                value={target}
                onChange={e => setTarget(e.target.value)}
                id="example-text"
              />
            </dd>
          </dl>
          <dl class="form-group">
            <dt>
              <label for="example-text">Commit message</label>
            </dt>
            <dd>
              <input
                class="form-control"
                type="text"
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                id="example-text"
              />
            </dd>
          </dl>
          <div class="Subhead Subhead--spacious">
            <div class="Subhead-heading">Pull Request</div>
          </div>
          <div class="form-checkbox">
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
            class="form-control input-block"
            type="text"
            placeholder="Pull request title"
            value={prTitle}
            onChange={e => setPrTitle(e.target.value)}
            id="example-text"
          />
        </form>
      </div>

      <div class="Box-footer text-right">
        <button type="button" class="btn  mr-2" data-close-dialog>
          Cancel
        </button>
        <button type="button" class="btn  mr-2" onClick={()=>setRoute("/files")}>
          Back
        </button>
        <button
          onClick={() => {
            setRoute("/execute");
          }}
          type="button"
          class="btn btn-primary"
          autofocus
          disabled={!prTitle}
        >
          Slice!
        </button>
      </div>
    </div>
  );
};
