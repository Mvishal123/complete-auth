import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendTwoFactorAuthenticationEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two factor authentication",
    html: `This is your 2FA code: ${token}`,
  });
};

const domain = process.env.NEXT_PUBLIC_APP_URL
console.log({domain});


export const sendVerificationMail = async (email: string, token: string) => {
  const VERIFY_TOKEN_URL = `${domain}/auth/verify?new_token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification",
    html: `<p>Click <a href=${VERIFY_TOKEN_URL}>here</a> to verify</p>`,
  });
};

export const sendResetPasswordMail = async (email: string, token: string) => {
  const RESET_TOKEN_URL = `${domain}/auth/reset-password/reset?new_token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account verification",
    html: `<p>Click <a href=${RESET_TOKEN_URL}>here</a> to reset password</p>`,
  });
};
