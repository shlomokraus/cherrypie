import { useState, useEffect, useContext } from "react";
import { CherryContext } from "../context/Cherry";
import { useGlobalState } from "../context/GlobalState";
import { CherryPieService} from "../service/CherryPie";
import { useWindowLocation } from "./windowLocation";

export const useCurrentPr = (number?) => {
    const cherry = useContext(CherryContext);
    const [pr, setPr] = useGlobalState("currentPr");
    const [error, setError] = useGlobalState("currentPrError");
    const location = useWindowLocation();

    useEffect(()=>{
        if(!cherry){
            return
        }
        if(!number) {
        
            const config = CherryPieService.parsePrUrl(location);
            if(config===undefined){
                return
            } else {
                number = config.number;
            }
        }

        if(pr&&pr.number===number){
            return
        }
       
        cherry.client().loadPr(number).then(setPr).catch(setError);
    }, [cherry, location]);

    return { pr, error }
}