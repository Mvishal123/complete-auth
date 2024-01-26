"use client"

import UserInfo from "@/components/UserInfo";
import { getClientSession } from "@/lib/client-session";

const ServerPage = () => {
  const session =  getClientSession();
  return (
    <div className="max-w-2xl w-full">
        <UserInfo label="Client component" session={session} />
    </div>
  );
};

export default ServerPage;
