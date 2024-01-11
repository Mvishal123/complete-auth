import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { LOGIN_REDIRECT_URL } from "@/routes";
const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: LOGIN_REDIRECT_URL,
    });
  };
  return (
    <div className="flex gap-2 w-full">
      <Button
        variant={"secondary"}
        className="flex-1"
        onClick={() => onClick("google")}
      >
        <FcGoogle />
      </Button>
      <Button
        variant={"secondary"}
        className="flex-1"
        onClick={() => onClick("github")}
      >
        <FaGithub />
      </Button>
    </div>
  );
};

export default Social;
