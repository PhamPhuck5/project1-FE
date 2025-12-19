import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import IntlProviderWrapper from "./hoc/IntProviderWrapper";

import { Provider } from "react-redux";
import reduxStore, { persistor } from "./redux";
import { PersistGate } from "redux-persist/integration/react";

import "./style/styles.scss";
import App from "./App";

console.log("main loaded");
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProviderWrapper>
            <App />
          </IntlProviderWrapper>
        </PersistGate>
      </Provider>
    </>
  </StrictMode>
);
