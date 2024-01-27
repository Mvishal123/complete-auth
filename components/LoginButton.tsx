"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import LoginForm from "./auth/LoginForm";

interface LoginButtonProps {
  children: ReactNode;
  asChild?: boolean;
  mode?: "modal" | "redirect";
}

const LoginButton = ({ children, asChild, mode }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="py-0 m-0">
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

export default LoginButton;
