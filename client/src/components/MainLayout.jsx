import React from "react";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 w-full max-w-[1200px] pt-[120px] pb-[80px]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
