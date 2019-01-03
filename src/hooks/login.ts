import { useState, useEffect, useContext } from "react";
import { CherryContext } from "../context/Cherry";
import { ProcessStatus } from "../constants";

export const useLogin = () => {
    const [status, setStatus] = useState(ProcessStatus.Idle);
    const [error, setError] = useState();
    const cherry = useContext(CherryContext);

    const login = async (params: {username?: string, password?: string, token?: string}) => {
        if(!cherry){
            throw Error("Missing Cherry service in context");
        }

        setStatus(ProcessStatus.Working);
        try {
            await cherry.init(params);
            setStatus(ProcessStatus.Done);
            return true;
        } catch(ex) {
            console.log("Init error", ex.message);
            setStatus(ProcessStatus.Failed);
            setError(ex.message);
            return false;
        }
    }

    return { login, status, error};
}