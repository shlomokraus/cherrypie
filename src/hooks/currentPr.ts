import { useState, useEffect, useContext } from "react";
import { PrContext } from "../context/PullRequest";

export const useCurrentPr = (number?) => {
    const {pr, error} = useContext(PrContext);
    return { pr, error }
}