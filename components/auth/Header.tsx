import React from "react";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center  gap-3">
      <h1 className="text-3xl font-semibold">🔐Auth</h1>
      <p className="text-slate-400 font-normal">{label}</p>
    </div>
  );
};

export default Header;
