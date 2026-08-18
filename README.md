# GreenCore Recycling LLC — Complete Website Demo

## Included
- Responsive Home, About, Products and Contact pages
- Product catalog
- Mobile navigation
- Quote/contact form
- Node.js + Express backend
- Nodemailer SMTP email delivery
- Messages are configured to be delivered to: joyroy123897@gmail.com

## Run locally
1. Install Node.js.
2. Open a terminal in this folder.
3. Run: npm install
4. Copy `.env.example` to `.env`
5. Set SMTP_USER to the Gmail account that will send the emails.
6. Set SMTP_PASS to a Gmail App Password (not your normal Gmail password).
7. Run: npm start
8. Open http://localhost:3000

## Important
The website cannot send email until SMTP credentials are configured on the server.
Never place SMTP credentials in frontend JavaScript.

## Going live
Upload the Node.js project to a Node-compatible host (for example a VPS, Render, Railway, or another Node hosting provider), configure the environment variables, and point your domain DNS to the host.

The current demo uses fictional GreenCore Recycling LLC information. Replace the address, phone, logo, product descriptions and images before production use.
