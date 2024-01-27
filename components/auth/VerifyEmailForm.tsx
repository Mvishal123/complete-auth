"use client";

import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./CardWrapper";
import { useSearchParams } from "next/navigation";

import { BeatLoader } from "react-spinners";
import verifyUser from "@/actions/verify-user";
import { ErrorMessage, SuccessMessage } from "../StatusMessage";

const VerifyEmailForm = () => {
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("new_token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Token not found");
      return;
    }

    verifyUser(token)
      .then((res) => {
        setSuccess(res.success), setError(res.error);
      })
      .catch(() => setError("Something went wrong"));
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [token, onSubmit]);

  return (
    <CardWrapper
      headerLabel="Verify email"
      backButtonHref="/auth/login"
      backButtonLabel="back to login"
    >
      <div className="w-full flex justify-center">
        {!success && !error && <BeatLoader />}
      </div>
      {error && <ErrorMessage label={error} />}
      {success && <SuccessMessage label={success} />}
    </CardWrapper>
  );
};

export default VerifyEmailForm;
