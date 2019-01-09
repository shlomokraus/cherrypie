import ReactDOM from "react-dom";
import React, { useEffect, useState, useRef } from "react";
import { App } from "../components/App";
import { useWindowLocation } from "../hooks/windowLocation";
import Modal from 'react-awesome-modal';
import { useGlobalState } from '../context/GlobalState';
import { SliceBtn } from "../components/SliceBtn";

const Emitter = require("tiny-emitter");
const emitter = new Emitter();


function updateDom(count = 0) {
  let files = document.getElementsByClassName("file-header");
  if (files && files.length !== count) {
    count = files.length;
    for (let i = 0; i < files.length; ++i) {
      try{
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
      } catch(ex){
        console.log("Unable to add a button for element", i, ex.message)
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
        className="btn btn-sm tooltipped tooltipped-nw BtnGroup-item cherry-action"
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

const useInjectMainSliceBtn = ({emitter}) => {
  const location = useWindowLocation();
  const [modalVisible, setModalVisible] = useGlobalState("modalVisible");

  useEffect(
    () => {
    const toolbar = document.querySelector(".diffbar .pr-review-tools");
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
      ReactDOM.render(<SliceBtn emitter={emitter} />, app);
    },
    [location]
  );
};

const ContentInject = () => {
  useInject();
  useInjectMainSliceBtn({emitter});
  const config = window.cherrypie; // Enable a way to inject config
  return <App config={config} emitter={emitter} />;
};

const app = document.createElement("div");
document.body.appendChild(app);
ReactDOM.render(<ContentInject />, app);
