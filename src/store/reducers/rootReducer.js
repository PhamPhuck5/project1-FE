import { combineReducers } from "redux";
//react router dom
import appReducer from "./appReducer";
import userReducer from "./userReducer";

import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import sessionStorage from "redux-persist/lib/storage"; // sessionStorage if save with session, storage if in local
import { persistReducer } from "redux-persist";

const persistCommonConfig = {
  storage: sessionStorage,
  stateReconciler: autoMergeLevel2,
};

const userPersistConfig = {
  ...persistCommonConfig,
  key: "user",
  whitelist: ["isLoggedIn", "userInfo"],
};

export default (history) =>
  combineReducers({
    app: appReducer,
    user: persistReducer(userPersistConfig, userReducer),
  });
