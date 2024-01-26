import { useSession } from "next-auth/react";

export const getClientSession = () => {
  const session = useSession();

  return session?.data?.user;
};
