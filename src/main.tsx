import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { IdentityKitProvider } from "@nfid/identitykit/react";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import "@nfid/identitykit/react/styles.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer />
    <Provider store={store}>
      <IdentityKitProvider
        signerClientOptions={{ targets: ["do25a-dyaaa-aaaak-qifua-cai"] }}
      >
        <App />
      </IdentityKitProvider>
    </Provider>
  </StrictMode>
);
