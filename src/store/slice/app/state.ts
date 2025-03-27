export interface ISignal {
    action: string;
    args?: any;
}

export interface AppState {
    signals: {
        [to: string]: ISignal | null;
    };
}

export const initialAppState: AppState = {
    signals: {},
};
