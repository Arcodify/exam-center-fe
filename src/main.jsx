import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { action as registerAction } from "./pages/Register/RegisterPage";
import { action as loginAction } from "./pages/Login/LoginPage";
import RootLayout from "./layout/RootLayout";

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

// Import React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a React Query client
const queryClient = new QueryClient();


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<NotFound />}>
      {/* Redirect root to login */}
      <Route index element={<Navigate to="login" replace />} />
      
      <Route path="*" element={<NotFound />} />

      {/* Routes for users who need to be logged out */}
      <Route element={<RequireLogout />}>
        <Route path="login" element={<LoginPage />} action={loginAction} />
        <Route path="register" element={<RegisterPage />} action={registerAction} />
      </Route>

      {/* Routes for authenticated users */}
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
    {/* Provide React Query client to the whole application */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
