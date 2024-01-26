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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { settingsSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { ErrorMessage, SuccessMessage } from "@/components/StatusMessage";

const SettingsPage = () => {
  const session = getClientSession();
  const { update } = useSession(); // to update client session

  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: session?.name || undefined,
      email: session?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: session?.role || undefined,
      twoFactorEnabled: session?.twoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    startTransition(() => {
      console.log("Submiting...");

      updateSettings(values)
        .then((res) => {
          if (res.success) {
            setSuccess(res.success);
            update();
          }
          if (res.error) {
            setError(res.error);
          }
        })
        .catch(() => setError("Something went wrong"))
        .finally(() => form.reset());
    });
  };

  return (
    <Card className="max-w-2xl w-full max-h-[60vh] overflow-y-scroll ">
      <CardHeader>
        <h1 className="text-2xl font-bold text-center">⚙️Settings</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
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

              {/* password */}

              <h1 className="font-bold">Change password</h1>
              <div className="pl-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 2FA */}
            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem className="mt-2 flex border py-1 px-3 rounded-md w-full justify-between">
                  <div>
                    <FormLabel>Two Factor Authentication</FormLabel>
                    <FormDescription>
                      Enable 2FA for high security
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="my-2">
              {success && <SuccessMessage label={success} />}
              {error && <ErrorMessage label={error} />}
            </div>
            <Button
              type="submit"
              className="mt-3 w-full"
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
