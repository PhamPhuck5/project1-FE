import React from "react";
import { useSelector } from "react-redux";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { path } from "../utils";
import OAuthSuccess from "../components/views/auth/oAuthSuccess.jsx";
import Home from "../components/views/home/home.jsx";
import Auth from "../components/views/auth/Auth.jsx";
import RootLayout from "../containers/RootLayout";

const System = () => {
  const systemMenuPath = path.systemMenuPath;
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to={systemMenuPath} replace />} />
        <Route path="login" element={<Auth />} />
        <Route path="/oAuthsuccess" element={<OAuthSuccess />} />
        <Route path="home" element={<Home />} />

        <Route path="*" element={<Navigate to={systemMenuPath} replace />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default System;
