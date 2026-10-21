const RESEND_API_URL = "https://api.resend.com/emails";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatSubmittedAt = (value) => {
  const date = value ? new Date(value) : new Date();

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });
};

export const sendEnquiryNotification = async (enquiry) => {
  const {
    RESEND_API_KEY,
    ENQUIRY_NOTIFICATION_EMAIL,
    EMAIL_FROM,
    ADMIN_URL = "https://gore-and-associate.vercel.app/admin"
  } = process.env;

  if (!RESEND_API_KEY || !ENQUIRY_NOTIFICATION_EMAIL || !EMAIL_FROM) {
    throw new Error(
      "Email notification is not configured. Set RESEND_API_KEY, ENQUIRY_NOTIFICATION_EMAIL and EMAIL_FROM."
    );
  }

  const safeName = escapeHtml(enquiry.name);
  const safePhone = escapeHtml(enquiry.phone);
  const safeEmail = escapeHtml(enquiry.email || "Not provided");
  const safeMessage = escapeHtml(
    enquiry.message || "No message provided"
  );
  const safeEnquiryId = escapeHtml(
    enquiry._id?.toString() || "N/A"
  );
  const submittedAt = escapeHtml(
    formatSubmittedAt(enquiry.createdAt)
  );

  const services =
    Array.isArray(enquiry.services) && enquiry.services.length
      ? enquiry.services
      : ["No service selected"];

  const servicesText = escapeHtml(
    services.join(", ")
  );

  const serviceRows = services
    .map(
      (service) =>
        '<tr>' +
        '<td style="padding:8px 10px;border-bottom:1px solid #eceff3;font-size:14px;color:#263238;">' +
        '<span style="color:#b58a2a;font-weight:700;">✓</span> ' +
        escapeHtml(service) +
        "</td>" +
        "</tr>"
    )
    .join("");

  const text = [
    "NEW CLIENT ENQUIRY",
    "",
    "Client: " + enquiry.name,
    "Phone: " + enquiry.phone,
    "Email: " + (enquiry.email || "Not provided"),
    "Services: " + servicesText,
    "Message: " + (enquiry.message || "No message provided"),
    "Submitted: " + submittedAt,
    "Enquiry ID: " + (enquiry._id?.toString() || "N/A"),
    "",
    "Review Enquiry: " + ADMIN_URL,
    "Please review and follow up with the client."
  ].join("\n");

  const html = [
    '<div style="margin:0;padding:24px 12px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">',
    '<tr><td align="center">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:680px;border-collapse:collapse;background:#ffffff;border:1px solid #e4e7eb;border-radius:14px;overflow:hidden;">',

    '<tr><td style="padding:28px 30px;background:#14202b;color:#ffffff;">',
    '<div style="font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#d7b45a;font-weight:700;margin-bottom:8px;">Abhishek Gore &amp; Associates</div>',
    '<div style="font-size:26px;line-height:1.25;font-weight:700;">New Client Enquiry</div>',
    '<div style="margin-top:8px;font-size:14px;line-height:1.6;color:#d8e0e7;">A new enquiry has been submitted through your website and is ready for review.</div>',
    "</td></tr>",

    '<tr><td style="padding:22px 30px 0 30px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#fff9ea;border:1px solid #ead59e;border-radius:10px;">',
    '<tr><td style="padding:13px 16px;font-size:14px;line-height:1.5;color:#6d5420;"><strong>Action required:</strong> Please review this enquiry and follow up with the client.</td></tr>',
    "</table>",
    "</td></tr>",

    '<tr><td style="padding:24px 30px 8px 30px;">',
    '<div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:#8a6a22;">Client Details</div>',
    "</td></tr>",

    '<tr><td style="padding:0 30px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border:1px solid #e7eaee;border-radius:10px;">',

    '<tr>',
    '<td width="34%" style="padding:13px 14px;background:#f8fafb;border-bottom:1px solid #e7eaee;font-size:13px;font-weight:700;color:#66727d;">Client</td>',
    '<td style="padding:13px 14px;border-bottom:1px solid #e7eaee;font-size:14px;font-weight:600;color:#1f2933;">' + safeName + "</td>",
    "</tr>",

    '<tr>',
    '<td style="padding:13px 14px;background:#f8fafb;border-bottom:1px solid #e7eaee;font-size:13px;font-weight:700;color:#66727d;">Phone</td>',
    '<td style="padding:13px 14px;border-bottom:1px solid #e7eaee;font-size:14px;"><a href="tel:' + safePhone + '" style="color:#1f5f8b;text-decoration:none;font-weight:600;">' + safePhone + "</a></td>",
    "</tr>",

    '<tr>',
    '<td style="padding:13px 14px;background:#f8fafb;border-bottom:1px solid #e7eaee;font-size:13px;font-weight:700;color:#66727d;">Email</td>',
    '<td style="padding:13px 14px;border-bottom:1px solid #e7eaee;font-size:14px;">' +
      (enquiry.email
        ? '<a href="mailto:' + safeEmail + '" style="color:#1f5f8b;text-decoration:none;font-weight:600;">' + safeEmail + "</a>"
        : '<span style="color:#66727d;">Not provided</span>') +
      "</td>",
    "</tr>",

    '<tr>',
    '<td style="padding:13px 14px;background:#f8fafb;font-size:13px;font-weight:700;color:#66727d;">Submitted</td>',
    '<td style="padding:13px 14px;font-size:14px;color:#1f2933;">' + submittedAt + "</td>",
    "</tr>",

    "</table>",
    "</td></tr>",

    '<tr><td style="padding:24px 30px 8px 30px;">',
    '<div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:#8a6a22;">Services Requested</div>',
    "</td></tr>",

    '<tr><td style="padding:0 30px;">',
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;border:1px solid #e7eaee;border-radius:10px;">',
    serviceRows,
    "</table>",
    "</td></tr>",

    '<tr><td style="padding:24px 30px 8px 30px;">',
    '<div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:#8a6a22;">Client Message</div>',
    "</td></tr>",

    '<tr><td style="padding:0 30px;">',
    '<div style="padding:17px 18px;background:#f8fafb;border-left:4px solid #c6a24a;border-radius:8px;font-size:14px;line-height:1.7;color:#35424d;white-space:pre-wrap;">',
    safeMessage,
    "</div>",
    "</td></tr>",

    '<tr><td style="padding:26px 30px 0 30px;text-align:center;">',
    '<a href="' + escapeHtml(ADMIN_URL) + '" style="display:inline-block;background:#b58a2a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 24px;border-radius:8px;">Review Enquiry &rarr;</a>',
    '<div style="margin-top:10px;font-size:12px;color:#7a858f;">Sign in to the admin dashboard to review the enquiry.</div>',
    "</td></tr>",

    '<tr><td style="padding:22px 30px 0 30px;">',
    '<div style="padding:12px 14px;background:#f3f5f7;border-radius:8px;font-size:12px;color:#66727d;">',
    '<strong style="color:#424d57;">Enquiry ID:</strong> ' + safeEnquiryId,
    "</div>",
    "</td></tr>",

    '<tr><td style="padding:28px 30px;text-align:center;color:#7a858f;font-size:12px;line-height:1.6;">',
    '<div style="height:2px;background:#d7b45a;width:52px;margin:0 auto 14px auto;"></div>',
    '<strong style="color:#263238;font-size:13px;">Abhishek Gore &amp; Associates</strong>',
    "<br />Tax Consultant",
    "<br />This is an automated notification from the website.",
    "</td></tr>",

    "</table>",
    "</td></tr>",
    "</table>",
    "</div>"
  ].join("");

  const payload = {
    from: EMAIL_FROM,
    to: [ENQUIRY_NOTIFICATION_EMAIL],
    subject: "New Client Enquiry — " + enquiry.name,
    text,
    html
  };

  if (enquiry.email) {
    payload.reply_to = enquiry.email;
  }

  const response = await fetch(
    RESEND_API_URL,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      "Resend email failed (" +
        response.status +
        "): " +
        details
    );
  }

  return response.json();
};
