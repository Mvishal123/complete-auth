import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={cn(
        "flex flex-col h-full justify-center items-center bg-gradient-to-r from-rose-100 to-teal-100",
        poppins.className
      )}
    >
      <h1 className="text-8xl font-bold text-black drop-shadow-xl">🔐Auth</h1>
      <h3 className="mt-2 text-slate-700 text-lg">
        A complete authentication system
      </h3>
      <div className="mt-12">
        <LoginButton asChild mode="modal">
          <Button variant="default" size="lg" className="font-bold">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </div>
  );
}
