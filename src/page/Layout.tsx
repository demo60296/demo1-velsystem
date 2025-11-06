import React from "react";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader variant="sticky" />
      <main className="flex-grow">{children}</main>
      <PublicFooter />
    </div>
  );
};

export default Layout;