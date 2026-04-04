import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import ReactDOM from "react-dom/client";
import toast, { Toaster, ToastBar } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" reverseOrder={false}>
          {(t) => (
            <div onClick={() => toast.dismiss(t.id)} className="cursor-pointer">
              <ToastBar toast={t} />
            </div>
          )}
        </Toaster>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
