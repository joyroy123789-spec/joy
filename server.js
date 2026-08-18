const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const TO_EMAIL = process.env.TO_EMAIL || "joyroy123897@gmail.com";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, product, quantity, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide your name, email and message."
    });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({
      success: false,
      message: "Email is not configured. Add SMTP_USER and SMTP_PASS to the .env file."
    });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const safe = value => String(value || "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:700px">
      <h2 style="color:#179447">New Website Inquiry — GreenCore Recycling LLC</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Phone:</strong> ${safe(phone || "Not provided")}</p>
      <p><strong>Product:</strong> ${safe(product || "Not specified")}</p>
      <p><strong>Quantity:</strong> ${safe(quantity || "Not specified")}</p>
      <p><strong>Message:</strong></p>
      <p>${safe(message).replace(/\n/g,"<br>")}</p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"GreenCore Website" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Website Inquiry: ${name}${product ? " - " + product : ""}`,
      html
    });

    res.json({
      success: true,
      message: "Thank you! Your message has been sent successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "We could not send your message. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`GreenCore Recycling website running on http://localhost:${PORT}`);
});
