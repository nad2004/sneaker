import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";


interface LayoutProps {
  search: string;
  setSearch: (value: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ search, setSearch }) => {
  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      
      <main className="container mx-auto p-4 !max-w-full">
        
        <Outlet  />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
