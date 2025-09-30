import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendverificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "akashsingh512367@gmail.com",
      to: email,
      subject: "EchoBox | verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification email send successfully" };
  } catch (emailError) {
    console.log("Error sedning email verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
