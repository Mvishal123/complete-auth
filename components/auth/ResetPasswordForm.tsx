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
import { resetPasswordMailSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { sendResetPasswordMail } from "@/lib/mail";
import { generateResetPasswordToken } from "@/lib/token";
import { Loader } from "lucide-react";
import { useState, useTransition } from "react";
import { sendResetMail } from "@/actions/reset-password";

const ResetPasswordForm = () => {
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof resetPasswordMailSchema>>({
    resolver: zodResolver(resetPasswordMailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordMailSchema>) => {
    setIsError("");
    setIsSuccess("");
    startTransition(async () => {
      sendResetMail(values.email).then((res) => {
        setIsError(res.error);
        setIsSuccess(res.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login page"
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="wayne.bruce@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isSuccess && <SuccessMessage label={isSuccess} />}
          {isError && <ErrorMessage label={isError} />}

          <Button disabled={isPending} className="w-full" type="submit">
            Send email
            {isPending && <Loader className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
