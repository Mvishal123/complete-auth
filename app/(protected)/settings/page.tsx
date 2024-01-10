import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { NOT_LOGIN_REDIRECT_URL } from "@/routes";

const SettingsPage = async () => {
  const user = await auth();
  return (
    <div>
      {user ? <>{JSON.stringify(user)}</> : "no user"}
      <br />
      <br />
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
