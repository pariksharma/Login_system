import { combineReducers, configureStore } from "@reduxjs/toolkit";
import logoutReducer from "../components/UserDetails/logoutSlice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import footerReducer from "../components/Footer/FooterSlice";

const combinereducer = combineReducers({
  footerDetail: footerReducer,
  logout: logoutReducer,
});
const rootReducer = (state, action) => {
  if (action.type == "logout/logoutAction") {
    state = {};
  }
  return combinereducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = store;
