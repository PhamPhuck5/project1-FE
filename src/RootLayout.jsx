import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./components/layout/Header.jsx";
const RootLayout = () => {
  return (
    <>
      <Header />
      <div className="row root-background">
        <div className="root-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default RootLayout;
