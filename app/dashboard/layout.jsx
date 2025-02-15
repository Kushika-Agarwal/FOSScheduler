import React from "react";
import SideNavbar from "./_components/SideNavbar";
import DashBoardHeader from "./_components/DashBoardHeader";

function DashBoardLayout({ children }) {
  return (
    <div>
      <div className="hidden md:block md:w-64 bg-slate-100 h-screen fixed">
        <SideNavbar />
      </div>
      <div className="md:ml-64">
        <DashBoardHeader />
        {children}
      </div>
      ;
    </div>
  );
}

export default DashBoardLayout;
