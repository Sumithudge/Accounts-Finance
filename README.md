# Accounts — React + Node.js

This is the React + Node.js version of the Accounts website.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- API: REST

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Run backend

Create `.env` from `.env.example`:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API runs at http://localhost:5000

## API endpoints

- `GET /api/health`
- `POST /api/enquiries`
- `GET /api/enquiries`

POST body:

```json
{
  "name":"Rahul",
  "phone":"+919876543210",
  "email":"rahul@example.com",
  "service":"ITR Filing",
  "message":"Need help filing my ITR"
}
```

## Important production steps

1. Replace demo contact details and WhatsApp number in the React app.
2. Set `MONGODB_URI` to your production MongoDB connection.
3. Restrict CORS to your production domain.
4. Add authentication/authorization before exposing the enquiry GET endpoint publicly.
5. Add secure object storage and authenticated upload endpoints for client documents.
6. Add rate limiting, validation, audit logs and HTTPS before production use.
7. Never ask clients to send Aadhaar, PAN, bank statements or other sensitive documents through an unsecured public form/WhatsApp. Provide an authenticated upload area.

The current backend intentionally keeps the first version small and safe: it handles enquiries and provides a clean foundation for the client portal.


## Enquiry email notifications

When a client submits an enquiry, the backend saves it to MongoDB and then sends a notification email through Resend. The enquiry submission still succeeds even if the email provider is temporarily unavailable.

Add these environment variables to the backend deployment:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
ENQUIRY_NOTIFICATION_EMAIL=your-review-inbox@example.com
EMAIL_FROM=Accounts Website <onboarding@resend.dev>
```

For production, verify your own sending domain in Resend and change `EMAIL_FROM` to an address on that verified domain. Keep `RESEND_API_KEY` secret; do not commit it to GitHub.
