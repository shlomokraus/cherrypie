import { useGlobalState } from "../context/GlobalState";
import { clone } from "lodash";
import { useState, useEffect } from "react";

export const useSlices = ()=>{
    const [slice, addSlice] = useState();
    const [slices, setSlices] = useGlobalState("slices");
    useEffect(()=>{
        if(slice && slices.indexOf(slice)<0){
            const cloned = clone(slices);
            cloned.push(slice);
            setSlices(cloned);
            addSlice(undefined);
        }
    }, [slice])
   

    const removeSlice = (path) => {
        const filtered = slices.filter(slice=>path!==slice);
        setSlices(filtered);
    }
    return {slices, addSlice, removeSlice, setSlices};
}