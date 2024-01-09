import React from "react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
const Social = () => {
  return (
    <div className="flex gap-2 w-full">
      <Button variant={"secondary"} className="flex-1">
        <FcGoogle />
      </Button>
      <Button variant={"secondary"} className="flex-1">
        <FaGithub />
      </Button>
    </div>
  );
};

export default Social;
