import { AnyAction, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import mapReducer from './slices/mapSlice';

const appReducer = combineReducers({
  map: mapReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === '@clearReduxState') {
    state = {} as RootState;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
