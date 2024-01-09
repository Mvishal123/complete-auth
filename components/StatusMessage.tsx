import { AlertTriangle, CheckCircle2 } from "lucide-react";
import React from "react";

interface StatusMessageProps {
  label?: string;
}
export const ErrorMessage = ({ label }: StatusMessageProps) => {
  return (
    <div className="w-full bg-red-400/75 text-red-800 flex gap-2 p-2 rounded-md">
      <AlertTriangle className="text-red-800 h-5 w-5" />
      <p>{label}</p>
    </div>
  );
};

export const SuccessMessage = ({ label }: StatusMessageProps) => {
  return (
    <div className="w-full bg-emerald-400/75 text-emerald-800 flex gap-2 p-2 rounded-md">
      <CheckCircle2 className="text-emerald-800 h-5 w-5" />
      <p>{label}</p>
    </div>
  );
};
