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
import { registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { register } from "@/actions/auth";
import { Loader } from "lucide-react";
import { useState, useTransition } from "react";

const RegisterForm = () => {
  const [isError, setIsError] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    setIsError("");
    setIsSuccess("");
    startTransition(() => {
      register(values).then((res) => {
        setIsSuccess(res.success);
        setIsError(res.error);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
      showSocials={true}
    >
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g: John Wick"
                      {...field}
                      type="input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input placeholder="*******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {isSuccess && <SuccessMessage label={isSuccess} />}
          {isError && <ErrorMessage label={isError} />}
          <Button disabled={isPending} className="w-full" type="submit">
            Sign up
            {isPending && <Loader className="h-4 w-4 animate-spin" />}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
