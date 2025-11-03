import { transporter } from "./utils";

export const forgotPassword = async (user: { email: string }, url: string) => {
  transporter.sendMail(
    {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "To reset password",
      text: `Click the link to reset your password :${url}`,
    },
    (error, info) => {
      console.log(error);
    }
  );
};
