# My learnings from this project

## Middlewares

- routes in middleware's matches array does not mean `private routes.` It just means that the middleware function gets invoked for the particular routes
- E.g. `matcher: ["/dashboard"]` means that on the "/dashboard" route is protected by the middleware function

## next-auth (v5)

### 1. Credentials provider

- #### Flow of callbacks

  > JWT -> Session

- #### Modifying session and token
  > - To add a new key to the session object, we need to pass it from token or directly manipulate it.
  > - For TypeScript, we also nee to change the default data type of the session and token if manipulated.
  >   e.g. Create a next-auth.d.ts file in root dir :point_down:

```typescript
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  userId: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
```

### 2. Google and GitHub providers

- We can Sign in without signing up with these providers.
  Inorder to do this, we need to make password attribute optional in our database as people using these providers to sign in need not use password, instead directly sign in with google, github or other providers

- #### 2FA
  Google, GitHub and other providers already has 2FA and are secured. Therefore, we need to implement 2FA only for credentials provider if needed.

### Email verification

- #### Token schema (db)

  ```typescript
  // no need to create a relation with the User model
  model VerificationToken {
    id  String @id @default(cuid())
    email String
    token String @unique
    expires DateTime

    @@unique([email, token]) // Only one token for a specific email
  }
  ```

- #### Sign in protection
  When using next-auth, whatever we do in backend to protect signing in, we need to do it in the `signIn()` callback provided by next-auth (auth.js now) to have complete protection

### Updating Session in real time

- #### Server session

  - We can fetch data from db in `token callback` and then update the tokens and pass it to `session callback` to update the server session

  - Example 👇

    ```ts
      async session({ session, token }) {
    if (session?.user && token.sub) {
      session.user.userId = token.sub;
    }

    if (token.role && session.user) {
      session.user.role = token.role as UserRole;
    }

    if (token.twoFactorEnabled && session.user) {
      session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
    }

    if (session.user) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.isOauth = token.isOauth as boolean;
    }

    return session;
    },
    async jwt({ token }) {
    if (!token.sub) {
      return token;
    }

    const existingUser = await getUserById(token.sub);
    if (!existingUser) {
      return token;
    }

    const isOauth = await getAccountById(existingUser.id);

    token.isOauth = !!isOauth;
    token.name = existingUser.name;
    token.email = existingUser.email;
    token.role = existingUser.role;
    token.twoFactorEnabled = existingUser.twoFactorEnabled as boolean;

    return token;
    },
    ```

  - The flow of program is from `jwt callback` to `session callback`

- #### Client session

  - We can't update the client session through callbacks but we can force update it by

  ```ts
    import { useSession } from "next-auth/react";

    const { update } = useSession();

    //fetch to db and change data...
    .then(() => update())
  ```
