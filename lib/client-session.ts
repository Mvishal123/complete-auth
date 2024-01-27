import { useSession } from "next-auth/react";

export const useGetClientSession = () => {
  const session = useSession();

  return session?.data?.user;
};
