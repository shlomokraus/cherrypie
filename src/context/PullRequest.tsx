import React from "react";
import { useState, useEffect, useContext } from "react";
import { CherryContext } from "./Cherry";
import { CherryPieService} from "../service/CherryPie";
import { useWindowLocation } from "../hooks/windowLocation";

const useLoadCurrentPr = (number?) => {
    const cherry = useContext(CherryContext);
    const [pr, setPr] = useState();
    const [error, setError] = useState();
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
       
        if(cherry.isInit){
            cherry.client().loadPr(number).then(setPr).catch(setError);
        } else {
            console.log("Cherry not initialize");
        }
    }, [cherry, cherry && cherry.isInit, location]);

    return { pr, error }
}

export const PrContext = React.createContext({pr:undefined, error: undefined});

export const PrProvider = props => {
    const {pr, error} = useLoadCurrentPr(props.number);
    return <PrContext.Provider value={{pr, error}}>{props.children}</PrContext.Provider>
} 