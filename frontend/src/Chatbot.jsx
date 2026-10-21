import { useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const WHATSAPP_NUMBER = "917666021252";
const CALL_NUMBER = "+917666021252";

const serviceOptions = [
  "Income Tax Return (ITR) Filing",
  "Income Tax Notice Assistance",
  "GST Registration & Return Filing",
  "GST Notice Assistance",
  "TDS / TCS Compliance",
  "PF Compliance",
  "PT Compliance",
  "Tax Computation & Planning",
  "Accounting & Bookkeeping",
  "Payroll Compliance",
  "Project Report Preparation",
  "Business Plan & Financial Projections"
];

const documentLists = {
  "Income Tax Return (ITR) Filing": [
    "PAN Card",
    "Aadhaar Card",
    "Form 16, if applicable",
    "Previous ITR acknowledgement",
    "AIS / Form 26AS",
    "Bank statements",
    "Capital gain statements, if applicable"
  ],

  "Income Tax Notice Assistance": [
    "Income Tax Notice",
    "PAN Card",
    "Aadhaar Card",
    "Previous ITR acknowledgement",
    "Relevant supporting documents",
    "Form 16 / income documents, if applicable"
  ],

  "GST Registration & Return Filing": [
    "PAN Card",
    "Aadhaar Card",
    "Business registration / constitution proof",
    "Address proof",
    "Bank details",
    "Digital signature, where applicable",
    "Previous GST records, if applicable"
  ],

  "GST Notice Assistance": [
    "GST Notice",
    "GSTIN details",
    "GST return copies",
    "Invoices / supporting records",
    "Relevant registration documents"
  ],

  "TDS / TCS Compliance": [
    "TAN details, if applicable",
    "PAN details",
    "TDS / TCS statements",
    "Challan details",
    "Salary / payment records",
    "Previous return details"
  ],

  "PF Compliance": [
    "Employer registration details",
    "PF establishment details",
    "Employee records",
    "Salary / payroll records",
    "Previous PF return details"
  ],

  "PT Compliance": [
    "Business / employer details",
    "Employee records",
    "Salary details",
    "Previous PT filing details"
  ],

  "Tax Computation & Planning": [
    "PAN Card",
    "Income details",
    "Salary / business income records",
    "Investment / deduction proofs",
    "Loan / interest details, if applicable",
    "Previous ITR, if available"
  ],

  "Accounting & Bookkeeping": [
    "Bank statements",
    "Sales invoices",
    "Purchase invoices",
    "Expense bills",
    "Receipts and payment details",
    "Previous accounting records"
  ],

  "Payroll Compliance": [
    "Employee master data",
    "Salary structure",
    "Attendance / payroll inputs",
    "PF / ESIC / PT details, if applicable",
    "Previous payroll records"
  ],

  "Project Report Preparation": [
    "Business profile",
    "Promoter / owner details",
    "Estimated project cost",
    "Revenue projections",
    "Expense assumptions",
    "Loan requirement details"
  ],

  "Business Plan & Financial Projections": [
    "Business idea / profile",
    "Promoter details",
    "Revenue assumptions",
    "Cost assumptions",
    "Existing financial information, if available",
    "Funding requirement"
  ]
};

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [selectedService, setSelectedService] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const resetChat = () => {
    setStep("welcome");
    setSelectedService("");
    setForm({
      name: "",
      phone: "",
      email: "",
      message: ""
    });
    setSubmitting(false);
    setSubmitted(false);
    setError("");
  };

  const chooseService = (service) => {
    setSelectedService(service);
    setStep("documents");
    setError("");
  };

  const goToQuery = () => {
    setStep("query");
    setError("");

    setForm((prev) => ({
      ...prev,
      message:
        prev.message ||
        `I need help with ${selectedService}.`
    }));
  };

  const submitQuery = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            services: [selectedService],
            message: form.message
          })
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to send your query."
        );
      }

      setSubmitted(true);
      setStep("success");

    } catch (submissionError) {
      console.error(
        "Chatbot enquiry error:",
        submissionError
      );

      setError(
        submissionError.message ||
          "Unable to send your query."
      );

    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Abhishek Gore & Associates, I need help with ${selectedService || "your services"}.`
  );

  const renderWelcome = () => (
    <>
      <div className="chatbot-greeting">
        <strong>Hello! 👋</strong>
        <p>
          I'm your 24/7 Accounts Assistant.
          Select a service and I’ll show you the
          typical documents required and help you
          send a query.
        </p>
      </div>

      <button
        type="button"
        className="chatbot-primary-button"
        onClick={() => setStep("services")}
      >
        View Filing & Service List
        <span>→</span>
      </button>

      <div className="chatbot-contact-row">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="chatbot-contact-button whatsapp"
        >
          WhatsApp
        </a>

        <a
          href={`tel:${CALL_NUMBER}`}
          className="chatbot-contact-button call"
        >
          Call Us
        </a>
      </div>
    </>
  );

  const renderServices = () => (
    <>
      <div className="chatbot-step-title">
        Select a filing or service
      </div>

      <div className="chatbot-service-list">
        {serviceOptions.map((service) => (
          <button
            key={service}
            type="button"
            className="chatbot-service-option"
            onClick={() => chooseService(service)}
          >
            <span>{service}</span>
            <b>›</b>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="chatbot-back-button"
        onClick={() => setStep("welcome")}
      >
        ← Back
      </button>
    </>
  );

  const renderDocuments = () => {
    const documents =
      documentLists[selectedService] || [];

    return (
      <>
        <div className="chatbot-step-title">
          Documents for
          <strong>{selectedService}</strong>
        </div>

        <div className="chatbot-note">
          Typical document checklist. Final requirements
          may vary based on your case.
        </div>

        <div className="chatbot-document-list">
          {documents.map((document) => (
            <div
              key={document}
              className="chatbot-document"
            >
              <span>✓</span>
              {document}
            </div>
          ))}
        </div>

        <button
          type="button"
          className="chatbot-primary-button"
          onClick={goToQuery}
        >
          Send a Query
          <span>→</span>
        </button>

        <div className="chatbot-contact-row">
          <a
            href={
              `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
            }
            target="_blank"
            rel="noreferrer"
            className="chatbot-contact-button whatsapp"
          >
            WhatsApp Assistant
          </a>

          <a
            href={`tel:${CALL_NUMBER}`}
            className="chatbot-contact-button call"
          >
            Call Us
          </a>
        </div>

        <button
          type="button"
          className="chatbot-back-button"
          onClick={() => setStep("services")}
        >
          ← Choose another service
        </button>
      </>
    );
  };

  const renderQuery = () => (
    <>
      <div className="chatbot-step-title">
        Tell us about your requirement
      </div>

      <div className="chatbot-selected-service">
        Selected:
        <strong>{selectedService}</strong>
      </div>

      <form
        className="chatbot-form"
        onSubmit={submitQuery}
      >
        <input
          type="text"
          placeholder="Your name *"
          value={form.name}
          required
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              name: event.target.value
            }))
          }
        />

        <input
          type="tel"
          placeholder="Phone number *"
          value={form.phone}
          required
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              phone: event.target.value
            }))
          }
        />

        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              email: event.target.value
            }))
          }
        />

        <textarea
          rows="4"
          placeholder="Tell us what you need help with..."
          value={form.message}
          required
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              message: event.target.value
            }))
          }
        />

        {error && (
          <div className="chatbot-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="chatbot-primary-button"
          disabled={submitting}
        >
          {submitting
            ? "Sending..."
            : "Submit Query"}
          {!submitting && <span>→</span>}
        </button>
      </form>

      <div className="chatbot-contact-row">
        <a
          href={
            `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
          }
          target="_blank"
          rel="noreferrer"
          className="chatbot-contact-button whatsapp"
        >
          WhatsApp
        </a>

        <a
          href={`tel:${CALL_NUMBER}`}
          className="chatbot-contact-button call"
        >
          Call Us
        </a>
      </div>

      <button
        type="button"
        className="chatbot-back-button"
        onClick={() => setStep("documents")}
      >
        ← Back to documents
      </button>
    </>
  );

  const renderSuccess = () => (
    <>
      <div className="chatbot-success">
        <div className="chatbot-success-icon">
          ✓
        </div>

        <strong>Query received</strong>

        <p>
          Thank you. Your enquiry has been sent to
          our team. You can also contact us directly
          on WhatsApp or by phone.
        </p>
      </div>

      <div className="chatbot-contact-row stacked">
        <a
          href={
            `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
          }
          target="_blank"
          rel="noreferrer"
          className="chatbot-contact-button whatsapp"
        >
          Continue on WhatsApp
        </a>

        <a
          href={`tel:${CALL_NUMBER}`}
          className="chatbot-contact-button call"
        >
          Call Abhishek Gore & Associates
        </a>
      </div>

      <button
        type="button"
        className="chatbot-back-button"
        onClick={resetChat}
      >
        Start another query
      </button>
    </>
  );

  const content = {
    welcome: renderWelcome,
    services: renderServices,
    documents: renderDocuments,
    query: renderQuery,
    success: renderSuccess
  }[step]();

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <div className="chatbot-header-title">
                Accounts Assistant
              </div>

              <div className="chatbot-header-status">
                <span className="chatbot-status-dot" />
                Available 24/7
              </div>
            </div>

            <button
              type="button"
              className="chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="chatbot-body">
            {content}
          </div>

          <div className="chatbot-footer">
            Abhishek Gore & Associates
          </div>
        </div>
      )}

      <button
        type="button"
        className={`chatbot-float-button ${open ? "open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open Accounts Assistant"
      >
        <span className="chatbot-float-icon">
          {open ? "×" : "💬"}
        </span>
        {!open && (
          <span className="chatbot-float-text">
            Need Help?
          </span>
        )}
      </button>
    </div>
  );
}

export default Chatbot;
