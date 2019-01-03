import { createStore } from 'react-hooks-global-state';
import { clone } from "lodash"
const reducer = (state, action) => {
    switch(action.type){
        case "add-message":
            const messages = clone(state.messages);
            messages.push(action.value);
            return {...state, messages }
        case "clear-messages":
            return {...state, messages:[] }
        default: 
            return {...state}
    }
}

const { GlobalStateProvider, dispatch, useGlobalState } = createStore(reducer, { messages: []});

const GlobalStoreProvider = GlobalStateProvider;
const useGlobalStore = useGlobalState;

export { GlobalStoreProvider, useGlobalStore, dispatch};