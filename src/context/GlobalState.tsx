import { createGlobalState, createStore } from 'react-hooks-global-state';
import { PullsGetResponse } from "@octokit/rest";
import { ProcessStatus } from '../constants';

export enum InitStatus {
    NotReady = "NotReady",
    NoAuth = "NoAuth",
    Idle = "Idle",
    Working = "Working",
    Done = "Done",
    Failed = "Failed"
}

export enum InitError {
    None = "None",
    NotAuth = "NotAuth",
    Unknown = "Unknown"
}

const { GlobalStateProvider, useGlobalState } = createGlobalState({
    modalVisible: false, 
    initStatus: ProcessStatus.Idle,
    initError: undefined as any,
    slices: [] as string[],
    messages: [] as string[],
    route: "/login",
    targetBranch: "",
    commitMessage: "",
    pullRequestTitle: "",
    currentPr: PullsGetResponse,
    currentPrError: undefined as any
});
export {GlobalStateProvider, useGlobalState};

