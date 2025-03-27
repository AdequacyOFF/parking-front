import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {initialAppState} from './state';

const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        addSignal(state, action: PayloadAction<{to: string; action: string; args?: any}>) {
            state.signals[action.payload.to] = {...action.payload};
        },
        clearSignal(state, action: PayloadAction<{to: string}>) {
            state.signals[action.payload.to] = null;
        },
    },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
