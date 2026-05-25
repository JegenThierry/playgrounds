import "dotenv/config";
import express from "express";
import cors from "cors";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

app.post("/api/send-phone", async (req, res) => {
  try {
    const toEmail = process.env.TO_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "Memory Test <onboarding@resend.dev>";

    if (!toEmail) {
      return res.status(500).json({ error: "TO_EMAIL not configured in .env" });
    }

    const phone = typeof req.query.phone === "string" ? req.query.phone.trim() : "";
    const phoneSafe = escapeHtml(phone);
    const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: "She gave you her number 💕",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <style>
              body { font-family: Georgia, serif; background: #fff2f8; margin: 0; padding: 0; }
              .wrapper { max-width: 520px; margin: 40px auto; background: #fff;
                         border-radius: 16px; overflow: hidden;
                         box-shadow: 0 8px 40px rgba(217,77,126,0.18); }
              .banner { background: linear-gradient(135deg, #ff7eaa, #d94d7e);
                        padding: 32px; text-align: center; }
              .banner .emoji { font-size: 3rem; }
              .banner h1 { color: #fff; font-size: 1.8rem; margin: 12px 0 0;
                           font-style: italic; }
              .body { padding: 32px; text-align: center; }
              .body p { color: #6b2c3f; font-size: 1.1rem; line-height: 1.7; }
              .number { display: inline-block; margin: 20px auto 8px;
                        padding: 14px 22px; background: #ffe4ee;
                        border: 1.5px dashed #ffc1d4; border-radius: 12px;
                        font-family: ui-monospace, Menlo, Consolas, monospace;
                        font-size: 1.4rem; font-weight: 700;
                        color: #d94d7e; letter-spacing: 0.04em; }
              .number a { color: #d94d7e; text-decoration: none; }
              .hearts { font-size: 1.8rem; letter-spacing: 6px; margin-top: 20px; }
              .footer { background: #fff2f8; padding: 16px; text-align: center;
                        color: #a85878; font-size: 0.85rem; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="banner">
                <div class="emoji">📞</div>
                <h1>She gave you her number!</h1>
              </div>
              <div class="body">
                <p>
                  Your "memory test" worked. She typed her phone number in
                  with her own two hands 😏<br/><br/>
                  Now go text her something charming.
                  You've got this! 💪
                </p>
                <div class="number"><a href="${telHref}">${phoneSafe}</a></div>
                <div class="hearts">💕 📱 💕 📱 💕</div>
              </div>
              <div class="footer">Sent with love via your phone-number memory test ✿</div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Email sent:", data.id);
    return res.json({ success: true, id: data.id });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Memory-test server running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser\n`);
});
