import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://accounts-finance.vercel.app")
).replace(/\/$/, "");

const WHATSAPP_NUMBER = "917666021252";
const CALL_NUMBER = "+917666021252";

const SERVICE_KNOWLEDGE = {
  "Income Tax Return (ITR) Filing": {
    aliases: ["itr", "income tax return", "income tax filing", "tax return", "return filing"],
    description: "ITR filing, tax computation, deductions, and return submission support.",
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Form 16, if applicable",
      "Previous ITR acknowledgement",
      "AIS / Form 26AS",
      "Bank statements",
      "Capital gain statements, if applicable"
    ]
  },
  "Income Tax Notice Assistance": {
    aliases: ["income tax notice", "tax notice", "notice", "intimation", "scrutiny", "demand notice"],
    description: "Help understanding and responding to income-tax notices and communications.",
    documents: [
      "Income Tax Notice / Intimation",
      "PAN Card",
      "Previous ITR acknowledgement",
      "Relevant supporting documents",
      "Form 16 / income documents, if applicable"
    ]
  },
  "GST Registration & Return Filing": {
    aliases: ["gst registration", "new gst", "gst return", "gst filing", "gstr", "gst compliance"],
    description: "GST registration, return filing, and routine GST compliance support.",
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Shop Act License, if applicable",
      "Place of Business proof",
      "Address proof",
      "NOC / consent letter if a supporting document is in another person's name",
      "Previous GST records, if applicable"
    ]
  },
  "GST Notice Assistance": {
    aliases: ["gst notice", "gst demand", "gst intimation", "gst scrutiny"],
    description: "Assistance with GST notices, replies, reconciliations, and supporting records.",
    documents: [
      "GST Notice",
      "GSTIN details",
      "GST return copies",
      "Invoices / supporting records",
      "Relevant registration documents"
    ]
  },
  "TDS / TCS Compliance": {
    aliases: ["tds", "tcs", "tds return", "tcs return", "tan", "withholding"],
    description: "TDS/TCS compliance, statements, challans, and related support.",
    documents: [
      "TAN details, if applicable",
      "PAN details",
      "TDS / TCS statements",
      "Challan details",
      "Salary / payment records",
      "Previous return details"
    ]
  },
  "PF Compliance": {
    aliases: ["pf", "epf", "provident fund", "pf compliance", "pf return"],
    description: "PF registration and recurring employer compliance support.",
    documents: [
      "Employer registration details",
      "PF establishment details",
      "Employee records",
      "Salary / payroll records",
      "Previous PF return details"
    ]
  },
  "PT Compliance": {
    aliases: ["pt", "professional tax", "professional tax compliance", "pt return"],
    description: "Professional Tax registration and filing support.",
    documents: [
      "Business / employer details",
      "Employee records",
      "Salary details",
      "Previous PT filing details"
    ]
  },
  "Tax Computation & Planning": {
    aliases: ["tax planning", "tax saving", "tax computation", "save tax", "tax calculation", "tax advice"],
    description: "Tax computation, planning, deductions, and scenario-based guidance.",
    documents: [
      "PAN Card",
      "Income details",
      "Salary / business income records",
      "Investment / deduction proofs",
      "Loan / interest details, if applicable",
      "Previous ITR, if available"
    ]
  },
  "Accounting & Bookkeeping": {
    aliases: ["accounting", "bookkeeping", "book keeping", "accounts", "accounting work", "books"],
    description: "Day-to-day accounting, bookkeeping, records, and financial reporting support.",
    documents: [
      "Bank statements",
      "Sales invoices",
      "Purchase invoices",
      "Expense bills",
      "Receipts and payment details",
      "Previous accounting records"
    ]
  },
  "Payroll Compliance": {
    aliases: ["payroll", "salary processing", "salary", "payroll compliance"],
    description: "Payroll processing and related PF / ESIC / PT compliance support.",
    documents: [
      "Employee master data",
      "Salary structure",
      "Attendance / payroll inputs",
      "PF / ESIC / PT details, if applicable",
      "Previous payroll records"
    ]
  },
  "Project Report Preparation": {
    aliases: ["project report", "project report preparation", "loan project report", "dpr"],
    description: "Business and project reports prepared for finance, lending, or planning requirements.",
    documents: [
      "Business profile",
      "Promoter / owner details",
      "Estimated project cost",
      "Revenue projections",
      "Expense assumptions",
      "Loan requirement details"
    ]
  },
  "Business Plan & Financial Projections": {
    aliases: ["business plan", "financial projections", "financial projection", "business projection", "startup plan"],
    description: "Business planning, financial projections, and funding-oriented models.",
    documents: [
      "Business idea / profile",
      "Promoter details",
      "Revenue assumptions",
      "Cost assumptions",
      "Existing financial information, if available",
      "Funding requirement"
    ]
  }
};

const SERVICE_NAMES = Object.keys(SERVICE_KNOWLEDGE);

const QUICK_START = [
  { label: "Find the right service", value: "I need help but I'm not sure which service I need." },
  { label: "Check documents", value: "What documents do I need?" },
  { label: "Ask a tax question", value: "I have a tax question." },
  { label: "Talk to an expert", value: "I want to speak with your team." }
];

const makeBotMessage = (text, options = []) => ({
  id: `bot-${Date.now()}-${Math.random()}`,
  role: "bot",
  text,
  options
});

const makeUserMessage = (text) => ({
  id: `user-${Date.now()}-${Math.random()}`,
  role: "user",
  text
});

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectServices(input) {
  const value = normalize(input);

  return SERVICE_NAMES.filter((service) => {
    const aliases = SERVICE_KNOWLEDGE[service].aliases;
    return aliases.some((alias) => value.includes(normalize(alias)));
  });
}

function wantsDocuments(input) {
  const value = normalize(input);
  return /(document|documents|paper|papers|proof|required|requirement|what do i need|need to submit)/i.test(value);
}

function wantsContact(input) {
  const value = normalize(input);
  return /(talk|speak|call|contact|expert|consult|consultation|appointment|human|person|team|help me|connect)/i.test(value);
}

function wantsWhatsApp(input) {
  const value = normalize(input);
  return /(whatsapp|message on whatsapp)/i.test(value);
}

function wantsCall(input) {
  const value = normalize(input);
  return /(^|\s)(call|phone|telephone)(\s|$)/i.test(value);
}

function asksPricing(input) {
  const value = normalize(input);
  return /(price|pricing|fee|fees|cost|charge|charges|how much|rate|quotation|quote)/i.test(value);
}

function asksAboutProcess(input) {
  const value = normalize(input);
  return /(how does it work|process|procedure|steps|what happens next|how to)/i.test(value);
}

function asksGeneralTax(input) {
  const value = normalize(input);
  return /(tax|itr|income|gst|tds|tcs|pf|pt|account|bookkeep|payroll|notice|deduction|refund|business plan|project report)/i.test(value);
}

function bestServiceFor(input) {
  const matches = detectServices(input);
  return matches[0] || "";
}

function getDocumentSummary(service) {
  const docs = SERVICE_KNOWLEDGE[service]?.documents || [];
  if (!docs.length) return "I can give you a tailored checklist once I know the service.";
  return docs.map((item) => `• ${item}`).join("\n");
}

function getServiceChoices(input) {
  const value = normalize(input);
  const keywords = value.split(" ").filter(Boolean);

  return SERVICE_NAMES
    .map((service) => {
      const searchable = [
        service,
        SERVICE_KNOWLEDGE[service].description,
        ...SERVICE_KNOWLEDGE[service].aliases
      ].join(" ").toLowerCase();

      const score = keywords.reduce(
        (total, keyword) => total + (searchable.includes(keyword) ? 1 : 0),
        0
      );

      return { service, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.service);
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => [
    makeBotMessage(
      "Hi! I’m Gore Assist — the smart assistant for Abhishek Gore & Associates. Tell me what you need in your own words. I can match your requirement to a service, explain the usual documents, answer general questions, and connect you with the team.",
      QUICK_START
    )
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [sendingLead, setSendingLead] = useState(false);

  const [lead, setLead] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, showLeadForm]);

  const recentUserText = useMemo(() => {
    return messages
      .filter((item) => item.role === "user")
      .slice(-3)
      .map((item) => item.text)
      .join(" ");
  }, [messages]);

  const contextService = selectedService || bestServiceFor(recentUserText);

  const whatsappText = encodeURIComponent(
    [
      "Hello Abhishek Gore & Associates,",
      "",
      contextService
        ? `I need help with: ${contextService}`
        : "I need help with your services.",
      recentUserText
        ? `My query: ${recentUserText.slice(0, 500)}`
        : ""
    ].filter(Boolean).join("\n")
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;
  const callUrl = `tel:${CALL_NUMBER}`;

  const addBotReply = (text, options = [], delay = 450) => {
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        makeBotMessage(text, options)
      ]);
    }, delay);
  };

  const openLeadForm = () => {
    setLeadError("");
    setShowLeadForm(true);

    addBotReply(
      "Absolutely. Share your name and phone number below. I’ll send your conversation to the team so they have the context before contacting you.",
      [],
      250
    );
  };

  const handleSmartMessage = (rawInput) => {
    const text = rawInput.trim();

    if (!text) return;

    setMessages((prev) => [...prev, makeUserMessage(text)]);
    setInput("");

    if (wantsWhatsApp(text)) {
      addBotReply(
        "Sure — WhatsApp is the fastest direct handoff. I’ve prepared a message with the context from this chat.",
        [],
        300
      );
      return;
    }

    if (wantsCall(text)) {
      addBotReply(
        "You can call the team directly on +91 76660 21252.",
        [
          { label: "Call now", action: "call" },
          { label: "Open WhatsApp", action: "whatsapp" }
        ],
        300
      );
      return;
    }

    const serviceMatches = detectServices(text);
    const detectedService = serviceMatches[0] || bestServiceFor(text);

    if (detectedService) {
      setSelectedService(detectedService);
    }

    if (asksPricing(text)) {
      const serviceForPricing = detectedService || selectedService;

      addBotReply(
        serviceForPricing
          ? `Fees for ${serviceForPricing} depend on the scope, records involved, and complexity of the case. The team can confirm the exact professional fee after reviewing your requirement.`
          : "Professional fees depend on the service and the complexity of the work. Tell me what you need and I’ll narrow it down for you.",
        [
          serviceForPricing
            ? { label: "Required documents", value: "What documents do I need?" }
            : null,
          { label: "Get a consultation", action: "lead" },
          { label: "WhatsApp team", action: "whatsapp" }
        ].filter(Boolean)
      );
      return;
    }

    if (wantsDocuments(text)) {
      const serviceForDocs = detectedService || selectedService;

      if (serviceForDocs) {
        addBotReply(
          `For ${serviceForDocs}, the usual checklist is:\n\n${getDocumentSummary(serviceForDocs)}\n\nThese are typical requirements; the exact checklist can change based on your case.`,
          [
            { label: "Tell me the process", value: "What is the process?" },
            { label: "Talk to an expert", action: "lead" }
          ]
        );
        return;
      }

      addBotReply(
        "Absolutely. Tell me which service you need documents for — for example, ITR, GST registration, GST notice, TDS, accounting, payroll, or a project report.",
        QUICK_START
      );
      return;
    }

    if (asksAboutProcess(text) && (detectedService || selectedService)) {
      const serviceForProcess = detectedService || selectedService;

      addBotReply(
        `For ${serviceForProcess}, the usual flow is: understand your requirement → review the relevant records → confirm the scope and documents → complete the filing / advisory work → update you on the outcome or next action.`,
        [
          { label: "Check documents", value: "What documents do I need?" },
          { label: "Get a consultation", action: "lead" }
        ]
      );
      return;
    }

    if (wantsContact(text)) {
      openLeadForm();
      return;
    }

    if (asksGeneralTax(text)) {
      const choices = getServiceChoices(text);

      if (choices.length > 1) {
        addBotReply(
          "I can help with that. Your message could fit more than one service. Which one is closest?",
          choices.map((service) => ({
            label: service,
            value: `I need ${service}`
          }))
        );
        return;
      }

      if (detectedService) {
        addBotReply(
          `It sounds like you may need ${detectedService}. ${SERVICE_KNOWLEDGE[detectedService].description}`,
          [
            { label: "Required documents", value: "What documents do I need?" },
            { label: "How it works", value: "What is the process?" },
            { label: "Talk to the team", action: "lead" }
          ]
        );
        return;
      }

      addBotReply(
        "I can help narrow it down. Tell me what happened or what you are trying to complete — for example: “I received a GST notice”, “I need to file my ITR”, “I need bookkeeping”, or “I need a project report for a loan”.",
        QUICK_START
      );
      return;
    }

    const lower = normalize(text);

    if (/^(hi|hello|hey|namaste|good morning|good afternoon|good evening)$/.test(lower)) {
      addBotReply(
        "Hello! 👋 What would you like help with today? You can type normally — no need to pick from a list.",
        QUICK_START
      );
      return;
    }

    if (/(what can you do|help me|features|options)/i.test(text)) {
      addBotReply(
        "I can understand your request in normal language, suggest the right service, show typical document requirements, explain the basic process, collect a consultation request, and connect you directly on WhatsApp or phone.",
        QUICK_START
      );
      return;
    }

    addBotReply(
      "I understand you need assistance, but I need a little more context. Tell me what you are trying to file, what notice you received, or what business/accounting problem you are facing.",
      [
        { label: "I have a tax notice", value: "I received a tax notice." },
        { label: "I need ITR help", value: "I need help with my ITR." },
        { label: "I need GST help", value: "I need help with GST." },
        { label: "Talk to an expert", action: "lead" }
      ]
    );
  };

  const submitLead = async (event) => {
    event.preventDefault();

    if (!lead.name.trim() || !lead.phone.trim()) {
      setLeadError("Name and phone number are required.");
      return;
    }

    setSendingLead(true);
    setLeadError("");

    const conversation = messages
      .filter((item) => item.role === "user")
      .slice(-8)
      .map((item) => `User: ${item.text}`)
      .join("\n");

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          email: lead.email.trim(),
          services: contextService ? [contextService] : [],
          message: [
            "Smart chatbot consultation request.",
            contextService ? `Detected service: ${contextService}` : "",
            conversation ? `Conversation context:\n${conversation}` : ""
          ].filter(Boolean).join("\n\n")
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send your request.");
      }

      setLeadSent(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        makeBotMessage(
          "Done — your request has been sent to the team. You can continue here, or use WhatsApp / phone for a direct conversation.",
          [
            { label: "WhatsApp team", action: "whatsapp" },
            { label: "Call the team", action: "call" }
          ]
        )
      ]);
    } catch (error) {
      console.error("Smart chatbot lead error:", error);
      setLeadError(
        error.message ||
          "Unable to send your request. Please try WhatsApp or call the team."
      );
    } finally {
      setSendingLead(false);
    }
  };

  const runAction = (item) => {
    if (item.action === "whatsapp") {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (item.action === "call") {
      window.location.href = callUrl;
      return;
    }

    if (item.action === "lead") {
      openLeadForm();
      return;
    }

    if (item.value) {
      handleSmartMessage(item.value);
    }
  };

  const resetChat = () => {
    setMessages([
      makeBotMessage(
        "Fresh start. Tell me what you need in your own words — I’ll help you figure out the right next step.",
        QUICK_START
      )
    ]);
    setInput("");
    setSelectedService("");
    setShowLeadForm(false);
    setLeadSent(false);
    setLeadError("");
    setLead({ name: "", phone: "", email: "" });
  };

  return (
    <div className="smart-chatbot-widget">
      {open && (
        <section
          className="smart-chatbot-panel"
          aria-label="Gore Assist smart assistant"
        >
          <header className="smart-chatbot-header">
            <div className="smart-chatbot-brand">
              <div className="smart-chatbot-avatar">GA</div>
              <div>
                <strong>Gore Assist</strong>
                <span>
                  <i /> Smart service assistant · 24/7
                </span>
              </div>
            </div>

            <button
              type="button"
              className="smart-chatbot-close"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </header>

          <div className="smart-chatbot-body" ref={bodyRef}>
            <div className="smart-chatbot-intro">
              <span className="smart-chatbot-intro-badge">SMART ASSISTANT</span>
              <h3>How can I help you today?</h3>
              <p>
                Type naturally. Example: “I got a GST notice” or “I need help filing my ITR.”
              </p>
            </div>

            <div className="smart-chatbot-thread">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`smart-chatbot-row ${message.role}`}
                >
                  {message.role === "bot" && (
                    <div className="smart-chatbot-mini-avatar">GA</div>
                  )}

                  <div className="smart-chatbot-message-wrap">
                    <div className="smart-chatbot-message">
                      {message.text.split("\n").map((line, index) => (
                        <span key={`${message.id}-${index}`}>
                          {line}
                          {index < message.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </div>

                    {message.options?.length > 0 && (
                      <div className="smart-chatbot-chips">
                        {message.options.map((option) => (
                          <button
                            type="button"
                            key={`${message.id}-${option.label}`}
                            onClick={() => runAction(option)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="smart-chatbot-row bot">
                  <div className="smart-chatbot-mini-avatar">GA</div>
                  <div className="smart-chatbot-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            {showLeadForm && (
              <form className="smart-chatbot-lead-card" onSubmit={submitLead}>
                <div>
                  <strong>Connect with the team</strong>
                  <span>We’ll receive the context from this chat.</span>
                </div>

                <input
                  type="text"
                  placeholder="Your name *"
                  value={lead.name}
                  onChange={(event) =>
                    setLead((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={lead.phone}
                  onChange={(event) =>
                    setLead((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={lead.email}
                  onChange={(event) =>
                    setLead((prev) => ({ ...prev, email: event.target.value }))
                  }
                />

                {leadError && (
                  <div className="smart-chatbot-error">{leadError}</div>
                )}

                <button
                  type="submit"
                  className="smart-chatbot-submit"
                  disabled={sendingLead}
                >
                  {sendingLead ? "Sending..." : "Send to the team"}
                  {!sendingLead && <span>→</span>}
                </button>
              </form>
            )}

            {leadSent && (
              <div className="smart-chatbot-trust-note">
                ✓ Your details were sent securely through the website enquiry form.
              </div>
            )}
          </div>

          <div className="smart-chatbot-composer">
            <div className="smart-chatbot-shortcuts">
              <button type="button" onClick={() => handleSmartMessage("What documents do I need?")}>
                Documents
              </button>
              <button type="button" onClick={() => handleSmartMessage("I want to talk to an expert.")}>
                Expert
              </button>
              <button type="button" onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}>
                WhatsApp
              </button>
            </div>

            <div className="smart-chatbot-input-row">
              <input
                ref={inputRef}
                type="text"
                value={input}
                placeholder="Type your question..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSmartMessage(input);
                  }
                }}
                aria-label="Message Gore Assist"
              />

              <button
                type="button"
                onClick={() => handleSmartMessage(input)}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <div className="smart-chatbot-bottom-actions">
              <button type="button" onClick={resetChat}>
                New chat
              </button>

              <a href={callUrl}>Call +91 76660 21252</a>
            </div>

            <small>
              General guidance only. Case-specific tax/legal decisions should be confirmed by the professional team.
            </small>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`smart-chatbot-fab ${open ? "active" : ""}`}
        onClick={() => {
          setOpen((value) => !value);
          window.setTimeout(() => inputRef.current?.focus(), 150);
        }}
        aria-label="Open Gore Assist"
      >
        <span className="smart-chatbot-fab-icon">{open ? "×" : "✦"}</span>
        {!open && <span>Ask Gore Assist</span>}
        {!open && <b>●</b>}
      </button>
    </div>
  );
}

export default Chatbot;
