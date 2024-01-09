import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
  backButtonHref: string;
  backButtonLabel: string;
}
const BackButton = ({ backButtonHref, backButtonLabel }: BackButtonProps) => {
  return (
    <Button asChild variant={"link"} className="w-full">
      <Link href={backButtonHref}>{backButtonLabel}</Link>
    </Button>
  );
};

export default BackButton;
