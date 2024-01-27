"use client";

import { testAdminServerAction } from "@/actions/adminTest";
import { ErrorMessage, SuccessMessage } from "@/components/StatusMessage";
import Rolegate from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetClientUserRole } from "@/lib/client-user-role";
import React from "react";
import { toast } from "sonner";

const Adminpage = () => {
  const userRole = useGetClientUserRole();

  const onAPIButtonClick = () => {
    fetch("api/admin")
      .then((res) => {
        if (res?.ok) {
          toast.success("API call successfull");
        } else {
          toast.error("No admin privelages");
        }
      })
      .catch(() => toast.error("Something went wrong"));
  };

  const onServerActionButtonClick = () => {
    testAdminServerAction().then((res) => {
      if (res.success) {
        toast.success(res.success);
        return;
      }

      if (res.error) {
        toast.error(res.error);
        return;
      }

      toast.error("Something went wrong");
    });
  };
  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <h1 className="text-center text-2xl font-bold">🔑Admin</h1>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <Rolegate currentRole={userRole!} allowedRole="ADMIN">
            <SuccessMessage label="You have admin privelages" />
          </Rolegate>
          <div className="w-full mt-4 space-y-3">
            <div className="w-full shadow-md py-2 px-6 flex justify-between items-center rounded-md">
              <p className="font-bold text-sm">Admin-only API route</p>
              <Button size="sm" onClick={onAPIButtonClick}>
                Test API route
              </Button>
            </div>
            <div className="w-full shadow-md py-2 px-6 flex justify-between items-center rounded-md">
              <p className="font-bold text-sm">Admin-only server action</p>
              <Button size="sm" onClick={onServerActionButtonClick}>
                Test server action
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Adminpage;
