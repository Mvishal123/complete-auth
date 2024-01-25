"use client";

import { ErrorMessage, SuccessMessage } from "@/components/StatusMessage";
import CardWrapper from "@/components/auth/CardWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { login } from "@/actions/login";
import { Loader } from "lucide-react";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const [showTwoFactorCode, setShowTwoFactorCode] = useState<Boolean>(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();
  const OAuthError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Account already linked with another provider"
      : "";
  console.log("OAUTH", OAuthError);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setIsError("");
    setIsSuccess("");
    startTransition(async () => {
      login(values).then((res) => {
        if (res.success) {
          form.reset();
          setIsSuccess(res.success);
        }

        if (res.error) {
          form.reset();
          setIsError(res.error);
        }

        if (res.twoFactor) {
          setEmail(values.email);
          setShowTwoFactorCode(true);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocials={true}
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          {!showTwoFactorCode && (
            <>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your-name@gmail.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Link
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "px-0",
                })}
                href="/auth/reset-password"
              >
                Forgot password?
              </Link>
            </>
          )}
          {showTwoFactorCode && (
            <div>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter 2FA code</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm mt-3 text-slate-500">sent to {email}</p>
            </div>
          )}

          {isSuccess && <SuccessMessage label={isSuccess} />}
          {isError && <ErrorMessage label={isError} />}
          {OAuthError && <ErrorMessage label={OAuthError} />}
          <Button disabled={isPending} className="w-full" type="submit">
            {showTwoFactorCode ? "Confirm" : "Login"}
            {isPending && <Loader className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
