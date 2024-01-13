import React from "react";
import CardWrapper from "./CardWrapper";
import { AlertTriangleIcon } from "lucide-react";

const AuthErrorCard = () => {
  return (
    <div>
      <CardWrapper
        headerLabel="Authentication error"
        backButtonHref="/auth/login"
        backButtonLabel="back to login"
      >
        <div className="w-full flex justify-center">
          <AlertTriangleIcon className="text-red-600"/>
        </div>
      </CardWrapper>
    </div>
  );
};

export default AuthErrorCard;
