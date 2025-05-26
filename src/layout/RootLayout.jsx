import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <main className="bg-neutral-50 font-Inter">
      <Navbar />
      <div className="p-5 pt-1 overflow-hidden">
        <Outlet />
      </div>
    </main>
  );
}

export default RootLayout;
