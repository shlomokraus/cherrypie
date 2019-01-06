import React, {useState, useEffect} from "react";

export const SliceBtn = ({ emitter}) => {
    const [slices, setSlices] = useState([]);
    useEffect(()=>{
        emitter.on('slices-updated', (slices)=>{
            setSlices(slices);
            setTimeout(()=>document.body.click(),2);
        })
    }, []);

    return slices.length ? <button onClick={()=>emitter.emit("show-modal")} className="btn btn-sm  btn-purple" aria-haspopup="dialog">
    Cherry Slice
    <span className="ml-2">{slices.length}</span>
  </button> : <div />
}