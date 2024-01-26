import { ExtendedUser } from "@/next-auth";
import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserinfoProps {
  session: ExtendedUser | undefined;
  label: string;
}
const UserInfo = ({ session, label }: UserinfoProps) => {
  return (
    <Card className="w-full bg-white flex flex-col items-center py-4 gap-6">
      <h1 className="text-2xl">
        <strong>{label}</strong>
      </h1>
      <div className="w-full px-3 space-y-2">
        <Card className="w-full py-2 px-3 border border-slate-200 flex justify-between items-center">
          <h1>
            <strong>ID</strong>
          </h1>
          <p className="text-xs bg-slate-200 p-1 rounded-md max-w-[250px] truncate">
            <code> {session?.userId}</code>
          </p>
        </Card>
        <Card className="w-full py-2 px-3 border border-slate-200 flex justify-between items-center">
          <h1>
            <strong>Name</strong>
          </h1>
          <p className="text-xs bg-slate-200 p-1 rounded-md max-w-[250px] truncate">
            <code> {session?.name}</code>
          </p>
        </Card>
        <Card className="w-full py-2 px-3 border border-slate-200 flex justify-between items-center">
          <h1>
            <strong>Email</strong>
          </h1>
          <p className="text-xs bg-slate-200 p-1 rounded-md max-w-[250px] truncate">
            <code> {session?.email}</code>
          </p>
        </Card>
        <Card className="w-full py-2 px-3 border border-slate-200 flex justify-between items-center">
          <h1>
            <strong>Role</strong>
          </h1>
          <p className="text-xs bg-slate-200 p-1 rounded-md max-w-[250px] truncate">
            <code> {session?.role}</code>
          </p>
        </Card>
        <Card className="w-full py-2 px-3 border border-slate-200 flex justify-between items-center">
          <h1>
            <strong>Two Factor Authentication (2FA)</strong>
          </h1>
          <Badge
            className="rounded-md"
            variant={session?.twoFactorEnabled ? "success" : "destructive"}
          >
            {session?.twoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </Card>
      </div>
    </Card>
  );
};

export default UserInfo;
