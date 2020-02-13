import React, { useContext, useEffect, useState} from "react";
import { useSlices } from "../hooks/slices";
import { CherryContext } from "../context/Cherry";
import { useGlobalState } from "../context/GlobalState";
import { useSlice } from "../hooks/cherry";
import { ProcessStatus } from "../constants";
import { useGlobalStore, dispatch } from "../context/GlobalStore";
import Octicon, { Check, X, MarkGithub } from "@githubprimer/octicons-react";
import { useCurrentPr } from "../hooks/currentPr";
import { CloseBtn } from "./CloseBtn";

export const Execute = props => {
  const [sliceInfo, setSliceInfo] = useGlobalState("sliceInfo");

  const { slices, setSlices } = useSlices();
  const { status, error, slice } = useSlice();
  const [messages] = useGlobalStore("messages");
  const [route, setRoute] = useGlobalState("route");
  const { pr } = useCurrentPr();
  const [cantRun, setCantRun] = useState(undefined);
  useEffect(
    () => {
      if (!pr) {
        return setCantRun("Pull request not loaded")
      }
      if(!sliceInfo || !sliceInfo.title || !sliceInfo.target){
        return setCantRun("Missing slice info");
      }
      slice({
        paths: slices,
        sourceBranch: pr.head.ref,
        targetBranch: sliceInfo.target,
        baseBranch: pr.base.ref,
        createPr: true,
        message: sliceInfo.title,
        prTitle: sliceInfo.title,
        prBody: sliceInfo.body
      });
    },
    [pr, sliceInfo]
  );

  if (!pr) {
    return <div>Pull request no loaded</div>;
  }

  return (
    <div>
      <div className="Box-header">
        <h3 className="Box-title">EXECUTING</h3>
      </div>
      <RenderStatus status={status} error={error} />
      
      {cantRun && <ErrorMessage error={cantRun}/>}
      <div style={{ minHeight: "300px" }}>
        {messages.map((message, index) => {
          let Icon = <Octicon width={16} icon={Check} />;
          const isLast = index === messages.length - 1;
          if (isLast) {
            if (status === ProcessStatus.Failed) {
              Icon = <Octicon width={16} icon={X} />;
            } else if (status === ProcessStatus.Working) {
              Icon = (
                <Octicon
                  width={16}
                  className="octicon octicon-mark-github anim-pulse"
                  icon={MarkGithub}
                />
              );
            }
          }

          return (
            <div
              className={`Box-row clearfix d-flex flex-items-center ${
                isLast && status === ProcessStatus.Working
                  ? "Box-row--unread"
                  : ""
              }`}
            >
              <div className="mr-1 Box-btn-octicon btn-octicon float-left">
                {Icon}
              </div>
              <div className="flex-auto">
                <strong>{message.title}</strong>
                <div className="text-small text-gray-light">{message.text}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="Box-footer text-right">
        <button
          disabled={status === ProcessStatus.Done}
          onClick={() => setRoute("/review")}
          type="button"
          className="btn mr-2"
        >
          Back
        </button>
        <span
          onClick={() => {
            if (status === ProcessStatus.Done) {
              setSlices([]);
            }
          }}
        >
          <CloseBtn
            reset={status === ProcessStatus.Done}
            disabled={status === ProcessStatus.Working}
            label={"Finish"}
          />
        </span>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === ProcessStatus.Working}
          onClick={() => slice({
            paths: slices,
            sourceBranch: pr.base.ref,
            targetBranch: pr.head.ref,
            baseBranch: pr.head.ref,
            createPr: false,
            message: "Removed sliced files from source pr",
            prTitle: undefined,
            prBody: undefined
          })}
        >
          Remove sliced files
        </button>
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }) => {
  error = error ? error : "Unknown Error";
  return (
    <div className="flash flash-full flash-error">Slice failed: {error}</div>
  );
};
const SuccessMessage = () => {
  return (
    <div className="flash flash-full flash-success">
      Slices served, enjoy your pie
    </div>
  );
};
const WorkingMessage = () => {
  return <div className="flash flash-full">Slicing...</div>;
};
const RenderStatus = ({ status, error }) => {
  switch (status) {
    case ProcessStatus.Working:
      return <WorkingMessage />;
    case ProcessStatus.Done:
      return <SuccessMessage />;
    case ProcessStatus.Failed:
      return <ErrorMessage error={error} />;
    default:
      return <div />;
  }
};
