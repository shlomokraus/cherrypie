import { useContext} from "react";
import { RouterContext } from "../context/Router";

export const useRouter = () => {
    const router = useContext(RouterContext);
    return router;
}