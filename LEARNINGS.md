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

<hr />

### Advanced Authentication

#### 1. Email verification

- generate a `token` and store it database

  ```ts
   //Example schema (Prisma ORM)
   model VerificationToken {
  id      String   @id @default(cuid())
  token   String   @unique
  email   String   @unique
  expires DateTime

  @@unique([token, email])
  }
  ```

- Send an email along with the token like `Click here to verify`

  - When clicked redirect to a `verify-page` which has the token in it's query-params

- Now get the token from URL and perform a check if it is present in the database and the email matches.

  - **YES**: Email verified successfully
  - **NO**: INVALID TOKEN

- Also keep a check of `expires` to make the application more secured

### 2. Reset password

- Send and email to the given email along with a `code`
- Store the code in the database in a similar manner
- The `link` in the mail redirects to a reset-password page. Reset the password and update it in Database

### 3. Two Factor Authentication (2FA)

- It has to enabled by the user. It is `OFF` by default.
- When it's `ON` the user can't just login directly, when he signs in, a mail is sent to the respective email.
- The mail has a code which we have to enter in the 2FA confirmation input, then we can sign in

- **Steps**
  1. Similar to other authentication practices, generate a `2FA token` and store it in the database.
  2. Also send the code in the email.
  3. The user then enters the code from the mail to the 2FA dialog and then if it matches, the user can login.
  4. Keep track of the expiry time to maintain best security practices

<hr />

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

```

```
