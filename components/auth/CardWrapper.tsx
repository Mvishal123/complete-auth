import { ReactNode } from "react";

import BackButton from "@/components/auth/BackButton";
import Header from "@/components/auth/Header";
import Social from "@/components/auth/Social";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CardWrapperProps {
  headerLabel: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
  children: ReactNode;
}

const CardWrapper = ({
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocials = false,
  children,
}: CardWrapperProps) => {
  return (
    <Card className="w-[450px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          backButtonHref={backButtonHref}
          backButtonLabel={backButtonLabel}
        />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
