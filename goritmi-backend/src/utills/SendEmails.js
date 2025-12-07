import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendVerificationEmail(to, otp) {
  const html = `
    <div style="font-family:sans-serif; line-height:1.5;">
      <h2>Verify your email address</h2> 
      <p>copy this otp</p>
      <p >${otp}</p>
    </div>
  `;

  await resend.emails.send({
    from: "Goritmi <onboarding@resend.dev>",
    to,
    subject: "Verify your email",
    html,
  });
}

export default sendVerificationEmail;
