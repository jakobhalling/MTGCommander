import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import gameReducer from './game/gameSlice';
import loggingMiddleware from '../middleware/loggingMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import persistenceMiddleware from '../middleware/persistenceMiddleware';

export const store = configureStore({
  reducer: {
    game: gameReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
      .concat(validationMiddleware)
      .concat(loggingMiddleware)
      .concat(persistenceMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 