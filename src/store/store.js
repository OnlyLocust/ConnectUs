import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import auth from './authSlice'; 
import posts from './postSlice'; 
import recv from './recvSlice'; 
import follow from './followSlice'
import search from './searchSlice'; 
import chat from './chatSlice'
import notification from './notificationSlice'

// persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist:['auth' , 'recv', 'follow']
};

// combine reducers
const rootReducer = combineReducers({
  auth,
  posts,
  recv,
  follow,
  search,
  chat,
  notification
});

// wrap with persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

// create persistor
export const persistor = persistStore(store);
