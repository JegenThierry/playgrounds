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

app.get("/api/send-yes", async (req, res) => {
  try {
    const toEmail = process.env.TO_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "Date Request <onboarding@resend.dev>";

    if (!toEmail) {
      return res.status(500).json({ error: "TO_EMAIL not configured in .env" });
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: "She said YES to a date!!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <style>
              body { font-family: Georgia, serif; background: #fdf6ec; margin: 0; padding: 0; }
              .wrapper { max-width: 520px; margin: 40px auto; background: #fff;
                         border-radius: 16px; overflow: hidden;
                         box-shadow: 0 8px 40px rgba(184,58,82,0.15); }
              .banner { background: linear-gradient(135deg, #e8637a, #b83a52);
                        padding: 32px; text-align: center; }
              .banner .emoji { font-size: 3rem; }
              .banner h1 { color: #fff; font-size: 1.8rem; margin: 12px 0 0;
                           font-style: italic; }
              .body { padding: 32px; text-align: center; }
              .body p { color: #3a1a22; font-size: 1.1rem; line-height: 1.7; }
              .hearts { font-size: 1.8rem; letter-spacing: 6px; margin-top: 20px; }
              .footer { background: #fdf6ec; padding: 16px; text-align: center;
                        color: #9e6070; font-size: 0.85rem; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="banner">
                <div class="emoji">💌</div>
                <h1>She said YES!!</h1>
              </div>
              <div class="body">
                <p>
                  Good news — your special someone just clicked <strong>Yes</strong>
                  to going on a date with you! 🥰<br/><br/>
                  Now it's your turn to plan something unforgettable.
                  You've got this! 💪
                </p>
                <div class="hearts">💕 🌹 💕 🌹 💕</div>
              </div>
              <div class="footer">Sent with love via your date-request page 🌹</div>
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Date request server running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser\n`);
});
