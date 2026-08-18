const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || "joyroy123789@gmail.com";

if (!process.env.RESEND_API_KEY) {
  console.warn("WARNING: RESEND_API_KEY is not configured.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Allow the GitHub Pages frontend to call this API.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://joyroy123789-spec.github.io");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "greencore-recycling" });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, product, quantity, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide your name, email and message."
    });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Email service is not configured."
    });
  }

  const safe = (value) => String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px">
      <h2 style="color:#179447">New Website Inquiry — GreenCore Recycling LLC</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Phone:</strong> ${safe(phone || "Not provided")}</p>
      <p><strong>Product:</strong> ${safe(product || "Not specified")}</p>
      <p><strong>Quantity:</strong> ${safe(quantity || "Not specified")}</p>
      <p><strong>Message:</strong></p>
      <p>${safe(message).replace(/\n/g, "<br>")}</p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [TO_EMAIL],
      replyTo: email,
      subject: `Website Inquiry: ${name}${product ? " - " + product : ""}`,
      html
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Email service could not send the message."
      });
    }

    console.log("Email sent:", data?.id);

    return res.json({
      success: true,
      message: "Thank you! Your message has been sent successfully."
    });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({
      success: false,
      message: "We could not send your message. Please try again."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GreenCore Recycling server running on port ${PORT}`);
});
