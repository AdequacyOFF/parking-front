import {configureStore} from '@reduxjs/toolkit';
import {rootApi} from './api';
import {appReducer} from './slice/app';

export const store = configureStore({
    reducer: {
        app: appReducer,
        [rootApi.reducerPath]: rootApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rootApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
