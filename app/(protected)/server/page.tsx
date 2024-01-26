import { auth } from "@/auth";
import UserInfo from "@/components/UserInfo";
import { Card } from "@/components/ui/card";
import { getServerSession } from "@/lib/server-session";

const ServerPage = async () => {
  const session = await getServerSession();
  return (
    <div className="max-w-2xl w-full">
        <UserInfo label="Server component" session={session} />
    </div>
  );
};

export default ServerPage;
