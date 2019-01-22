import { useGlobalState } from "../context/GlobalState";
import React from "react";
import { useSlices } from "../hooks/slices";

export const CloseBtn = ({label, disabled, reset}: {label: string, disabled?: boolean, reset?: boolean}) => {
  const [modalVisible, setModalVisible] = useGlobalState("modalVisible");
  const { slices, setSlices } = useSlices();

    return <button
    disabled={disabled}
    type="button"
    className="btn btn-secondary mr-2"
    onClick={()=>{
      if(reset){
        setSlices([]);
      }
      setModalVisible(false);
    }}
  >
    {label}
  </button>
}