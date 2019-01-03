import React, { useContext, useEffect } from "react";
import { useSlices } from "../hooks/slices";
import { CherryContext } from "../context/Cherry";
import { useGlobalState } from "../context/GlobalState";
import { useSlice } from "../hooks/cherry";
import { ProcessStatus } from "../constants";
import { useGlobalStore, dispatch } from "../context/GlobalStore";

export const Execute = props => {
  const { slices } = useSlices();
  const { status, error, slice } = useSlice();
  const [messages] = useGlobalStore("messages");
  console.log("Messages is", messages);
  const [route, setRoute] = useGlobalState("route");
  const [target] = useGlobalState("targetBranch");
  const [commitMessage] = useGlobalState("commitMessage");
  const [prTitle] = useGlobalState("pullRequestTitle");

  const cherry = useContext(CherryContext);

  useEffect(()=>{
    const pr = cherry.pr();
    if (!pr) {
        return <div>Pull request no loaded</div>;
      }
      slice({
        paths: slices,
        sourceBranch: pr.head.ref,
        targetBranch: target,
        baseBranch: pr.base.ref,
        createPr: true,
        prTitle
      });
  },[])
  

  return (
    <div>
      <div class="Box-header">
        <button
          class="Box-btn-octicon btn-octicon float-right"
          type="button"
          aria-label="Close dialog"
          data-close-dialog
        >
          close
        </button>
        <h3 class="Box-title">Execute</h3>
      </div>
      <RenderStatus status={status} error={error} />
        <div style={{minHeight: "300px"}}>
          {messages.map((message, index) => {
              let Icon = <CheckIcon />
            const isLast = index === messages.length - 1;
            if(isLast){
                if(status===ProcessStatus.Failed){
                    Icon = <CrossIcon />
                } else if (status===ProcessStatus.Working){
                    Icon = <PulseIcon />
                }
            }
            
            return (
                <div class={`Box-row clearfix d-flex flex-items-center ${isLast && status===ProcessStatus.Working ? "Box-row--unread" : ""}`}>
                <div  class="mr-1 Box-btn-octicon btn-octicon float-left">{Icon}</div>
                <div class="flex-auto">
                  <strong>{message.title}</strong>
                  <div class="text-small text-gray-light">
                  {message.text}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div class="Box-footer text-right">
        <button
          onClick={() => setRoute("/slice")}
          type="button"
          class="btn mr-2"
        >
          Back
        </button>
        <button disabled={status===ProcessStatus.Working} type="button" class="btn mr-2" data-close-dialog>
          Close
        </button>
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }) => {
  error = error ? error : "Unknown Error";
  return <div class="flash flash-full flash-error">Slice failed: {error}</div>;
};
const SuccessMessage = () => {
  return (
    <div class="flash flash-full flash-success">
      Slices served, enjoy your pie
    </div>
  );
};
const WorkingMessage = () => {
  return <div class="flash flash-full">Slicing...</div>;
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

const PulseIcon = () => {
  return (
    <svg
      height="16"
      class="octicon octicon-mark-github anim-pulse"
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
};

const CheckIcon = () => {
  return (
    <svg
      height="16"
      width="16"
      class="octicon octicon-check d-block mx-auto"
      viewBox="0 0 12 16"
      version="1.1"
      aria-hidden="true"
    >
      <path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z" />
    </svg>
  );
};

const CrossIcon = () => {
  return (
    <svg
      height="16"
      width="16"
      class="octicon octicon-x d-block mx-auto"
      viewBox="0 0 12 16"
      version="1.1"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
      />
    </svg>
  );
};

