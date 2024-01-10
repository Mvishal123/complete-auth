# My learnings from this project

## Middlewares

- routes in middleware's matches array does not mean `private routes.` It just means that the middleware function gets invoked for the      particular routes
- E.g. `matcher: ["/dashboard"]` means that on the "/dashboard" route is protected by the middleware function

## next-auth (v5)
- Flow of callbacks
> JWT -> Session