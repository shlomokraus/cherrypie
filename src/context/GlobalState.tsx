import { createGlobalState, createStore } from 'react-hooks-global-state';
import { PullsGetResponse } from "@octokit/rest";

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
    initStatus: InitStatus.NotReady,
    initError: InitError.None,
    reverts: [] as string[],
    slices: [] as string[],
    messages: [] as string[],
    route: "/login",
    targetBranch: "",
    commitMessage: "",
    pullRequestTitle: ""
});
export {GlobalStateProvider, useGlobalState};

