# My learnings from this project

## Middlewares

- routes in middleware's matches array does not mean `private routes.` It just means that the middleware function gets invoked for the particular routes
- E.g. `matcher: ["/dashboard"]` means that on the "/dashboard" route is protected by the middleware function

## next-auth (v5)

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
