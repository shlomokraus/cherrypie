import "reflect-metadata";
import ReactDOM from "react-dom";
import React, { useEffect, useState, useRef } from "react";
import { App } from "../components/App";
import { useWindowLocation } from "../hooks/windowLocation";

const Emitter = require("tiny-emitter");
const emitter = new Emitter();


function updateDom(count = 0) {
  let files = document.getElementsByClassName("file-header");
  if (files && files.length !== count) {
    console.log("New count, updating DOM!", files.length, count);
    count = files.length;
    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      const name = file.getElementsByClassName("file-info")[0].children[1]
        .title;

      const actions = file
        .getElementsByClassName("file-actions")[0]
        .getElementsByClassName("BtnGroup")[0];
      const existing = actions.getElementsByClassName("cherry-action");
      if (existing.length === 0) {
        const elm = document.createElement("span");
        elm.className = "cherry-action";
        actions.appendChild(elm);
        ReactDOM.render(
          <>
            <GithubActionBtn
              title="Slice"
              action={() => {
                emitter.emit("file-slice", name);
              }}
            />
          </>,
          elm
        );
      }
    }
  }

  return files ? files.length : 0;
}

const GithubActionBtn = ({ title, action }) => {
  return (
    <>
      <a
        onClick={action}
        class="btn btn-sm tooltipped tooltipped-nw BtnGroup-item cherry-action"
        rel="nofollow"
        aria-label="Revert"
      >
        {title}
      </a>
    </>
  );
};

const useDomUpdated = (): MutationEvent => {
	const [nodes, setNodes] = useState(undefined);
  
	useEffect(() => {
	  document.addEventListener(
		"DOMNodeInserted",
		val => {
		  setNodes(val);
		},
		false
	  );
	}, []);
  
	return nodes;
  };

const useInject = () => {
  const ref = useRef();
  const nodes = useDomUpdated();

  // Inject the slice button
  useEffect(
    () => {
      ref.current = updateDom(ref.current);
    },
    [nodes]
  );

};

const useInjectMainSliceBtn = () => {
  const location = useWindowLocation();
  useEffect(
    () => {
	 const toolbar = document.querySelector(".diffbar .pr-review-tools");
		console.log("Toolbar", toolbar)
      if (!toolbar) {
        return
      }
      const existing = document.querySelector(".cherry-pie-toolbar");
      if (existing) {
        return
      }
      const app = document.createElement("div");
      app.className = "diffbar-item cherry-pie-toolbar";
      toolbar.insertBefore(app, toolbar.firstChild);
      ReactDOM.render(<App emitter={emitter} />, app);
    },
    [location]
  );
};

const ContentInject = () => {
  useInject();
  useInjectMainSliceBtn();
  return <div />;
};

const app = document.createElement("div");
document.body.appendChild(app);
ReactDOM.render(<ContentInject />, app);
