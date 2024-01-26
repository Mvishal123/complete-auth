import { UserRole } from "@prisma/client";
import React from "react";
import { ErrorMessage } from "../StatusMessage";

interface RoleGateProps {
  allowedRole: UserRole;
  currentRole: UserRole;
  children: React.ReactNode;
}
const Rolegate = ({ allowedRole, children, currentRole }: RoleGateProps) => {
  if (currentRole !== allowedRole) {
    return <ErrorMessage label="You do not have access to admin privelages" />;
  }

  return <div>{children}</div>;
};

export default Rolegate;
