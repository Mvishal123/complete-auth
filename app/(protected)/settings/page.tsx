import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { NOT_LOGIN_REDIRECT_URL } from "@/routes";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      {session ? <>{JSON.stringify(session)}</> : "no user"}
      
      <br />
      <br />
      {session?.user.userId}
      <form
        action={async () => {
          "use server";
          await signOut({
            redirectTo: NOT_LOGIN_REDIRECT_URL
          });
        }}
      >
        <Button>Log out</Button>
      </form>
    </div>
  );
};

export default SettingsPage;
