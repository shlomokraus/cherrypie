import { Route, Switch } from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import { useSlices } from "../hooks/slices";
import { useGlobalState, InitStatus } from "../context/GlobalState";
import { useStorage } from '../hooks/storage';
import { Routes } from "./Routes";
import Modal  from "react-awesome-modal";
export const Root = () => {
  const [modalVisible, setModalVisible] = useGlobalState("modalVisible");
  return (<Modal width="450" visible={modalVisible} onClickAway={()=>setModalVisible(false)}><div className="Box d-flex flex-column" ><Routes /></div></Modal>
  );
};
