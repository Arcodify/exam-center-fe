import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import RootLayout from "./layout/RootLayout";
import { action as registerAction } from "./pages/Register/RegisterPage";
import { action as loginAction } from "./pages/Login/LoginPage";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

import {
  LoginPage,
  Question,
  RegisterPage,
  NotFound,
  SingleQuestion,
  RequireAuth,
  RequireLogout,
  Success,
} from "./pages";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetworkStatusWrapper from "./components/NetworkStatusWrapper";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="*" element={<NotFound />} />
      <Route element={<RequireLogout />}>
        <Route path="login" element={<LoginPage />} action={loginAction} />
        <Route path="register" element={<RegisterPage />} action={registerAction} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/question" element={<Question />} />
        <Route path="/question/:id" element={<SingleQuestion />} />
        <Route path="finish" element={<Success />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <NetworkStatusWrapper> */}
        <RouterProvider router={router} />
      {/* </NetworkStatusWrapper> */}
    </QueryClientProvider>
  </React.StrictMode>
);
