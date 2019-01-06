import { useGlobalState } from "../context/GlobalState";
import React from "react";

export const CloseBtn = ({label, disabled}: {label: string, disabled?: boolean}) => {
  const [modalVisible, setModalVisible] = useGlobalState("modalVisible");

    return <button
    disabled={disabled}
    type="button"
    className="btn btn-secondary mr-2"
    onClick={()=>setModalVisible(false)}
  >
    {label}
  </button>
}