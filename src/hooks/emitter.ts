import { useEffect, useState } from "react";
import { useGlobalState} from "../context/GlobalState";
import { clone } from "lodash";
import { useSlices } from "./slices";

export const useEmitter = (emitter) => {
    const {addSlice} = useSlices();
    useEffect(() => {
		emitter.on("file-slice", filename => {
            addSlice(filename);
		});
    }, [emitter]);
}
    