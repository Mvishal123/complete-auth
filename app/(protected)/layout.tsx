import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Navbar from "./_components/navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: LayoutProps) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="h-full w-full flex flex-col justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100 gap-6">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default layout;
