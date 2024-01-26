"use client";

import { Card } from "@/components/ui/card";
import { getClientSession } from "@/lib/client-session";

const SettingsPage = () => {
  const session = getClientSession();

  return (
    <div>
      <Card></Card>
    </div>
  );
};

export default SettingsPage;
