import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}
const layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full h-full bg-gradient-to-r from-rose-100 to-teal-100 flex justify-center items-center">
      {children}
    </div>
  );
};

export default layout;
