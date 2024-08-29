import { JdRequest } from "@/types";
import { sendEmail } from "@/utils/send-email";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();
  const { jobDescription, email, position } = body as unknown as JdRequest;
  if (!jobDescription || !email || !position) {
    return new NextResponse(
      JSON.stringify({
        error: "Please provide a job description, email and position",
      }),
      { status: 400 }
    );
  }

  // Send email
  try {
    await sendEmail(email,jobDescription, position);
    return new NextResponse(
      JSON.stringify({ message: `Email sent successfully at: ${email}` }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Failed to send email" + error }),
      { status: 500 }
    );
  }
};
