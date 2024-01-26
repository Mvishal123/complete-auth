"use client";

import { getClientSession } from "@/lib/client-session";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { updateSettings } from "@/actions/update-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { settingsSchema } from "@/schemas";
import { useTransition } from "react";
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const session = getClientSession();
  const { update } = useSession(); // to update client session

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      // name: session?.name || undefined,
      email: session?.email || undefined,
      // password: undefined,
      // newPassword: undefined,
      // role: session?.role || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    startTransition(() => {
      console.log("Submiting...");

      updateSettings(values).then((res) => update());
    });
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">Settings</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="bruce.wayne@gmail.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-3"
              size="sm"
              disabled={isPending}
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
