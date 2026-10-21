const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sendEnquiryNotification = async (enquiry) => {
  const {
    RESEND_API_KEY,
    ENQUIRY_NOTIFICATION_EMAIL,
    EMAIL_FROM
  } = process.env;

  if (!RESEND_API_KEY || !ENQUIRY_NOTIFICATION_EMAIL || !EMAIL_FROM) {
    throw new Error(
      "Email notification is not configured. Set RESEND_API_KEY, ENQUIRY_NOTIFICATION_EMAIL and EMAIL_FROM."
    );
  }

  const safeName = escapeHtml(enquiry.name);
  const safePhone = escapeHtml(enquiry.phone);
  const safeEmail = escapeHtml(enquiry.email || "Not provided");
  const safeServices = escapeHtml(
    Array.isArray(enquiry.services) && enquiry.services.length
      ? enquiry.services.join(", ")
      : "Not specified"
  );
  const safeMessage = escapeHtml(enquiry.message || "No message provided");
  const enquiryId = escapeHtml(enquiry._id?.toString() || "N/A");

  const text = [
    "New client enquiry",
    "",
    `Client: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email || "Not provided"}`,
    `Services: ${Array.isArray(enquiry.services) && enquiry.services.length ? enquiry.services.join(", ") : "Not specified"}`,
    `Message: ${enquiry.message || "No message provided"}`,
    `Enquiry ID: ${enquiry._id?.toString() || "N/A"}`
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 8px;">New Client Enquiry</h2>
      <p>A new enquiry has been submitted through the website.</p>

      <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
        <tr>
          <td style="padding: 8px 0; font-weight: 700;">Client</td>
          <td style="padding: 8px 0;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700;">Phone</td>
          <td style="padding: 8px 0;">${safePhone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700;">Email</td>
          <td style="padding: 8px 0;">${safeEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700;">Services</td>
          <td style="padding: 8px 0;">${safeServices}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700; vertical-align: top;">Message</td>
          <td style="padding: 8px 0; white-space: pre-wrap;">${safeMessage}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700;">Enquiry ID</td>
          <td style="padding: 8px 0;">${enquiryId}</td>
        </tr>
      </table>
    </div>
  `;

  const payload = {
    from: EMAIL_FROM,
    to: [ENQUIRY_NOTIFICATION_EMAIL],
    subject: `New Client Enquiry — ${enquiry.name}`,
    text,
    html
  };

  if (enquiry.email) {
    payload.reply_to = enquiry.email;
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend email failed (${response.status}): ${details}`);
  }

  return response.json();
};
