"use client";

import { ErrorMessage, SuccessMessage } from "@/components/StatusMessage";
import CardWrapper from "@/components/auth/CardWrapper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { resetPassword } from "@/actions/reset-password";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

const ChangePasswordForm = () => {
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("new_token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      cpassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    setIsError("");
    setIsSuccess("");

    startTransition(() => {
      if (values.cpassword !== values.password) {
        setIsError("Passwords must match");
        return;
      }

      resetPassword(token!, values.password).then((data) => {
        setIsError(data.error);
        setIsSuccess(data.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Change your password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login page"
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isSuccess && <SuccessMessage label={isSuccess} />}
          {isError && <ErrorMessage label={isError} />}
          <Button
            disabled={form.formState.isLoading}
            className="w-full"
            type="submit"
          >
            Change password
            {isPending && <Loader className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ChangePasswordForm;
