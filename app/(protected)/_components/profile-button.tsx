"use client";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogOut, User, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface ProfileButtonProps {
  imageUrl: string | undefined;
}
const ProfileButton = ({ imageUrl }: ProfileButtonProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarFallback>
              <User className="fill-black" />
            </AvatarFallback>
            <AvatarImage src={imageUrl ?? ""} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full flex justify-center">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => {
              signOut();
            }}
          >
            <LogOut className="w-4 h-4 rotate-180 mr-2" />
            Sign out
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileButton;
