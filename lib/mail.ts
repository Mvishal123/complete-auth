import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationMail = async (email: string, token: string) => {
  const VERIFY_TOKEN_URL = `http://localhost:3000/auth/verify?new_token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification",
    html: `<p>Click <a href=${VERIFY_TOKEN_URL}>here</a> to verify</p>`,
  });
};

export const sendResetPasswordMail = async (email: string, token: string) => {
  const VERIFY_TOKEN_URL = `http://localhost:3000/auth/reset-password/reset?new_token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification",
    html: `<p>Click <a href=${VERIFY_TOKEN_URL}>here</a> to reset password</p>`,
  });
};
