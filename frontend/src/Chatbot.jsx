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
    aliases: [
      "itr",
      "income tax return",
      "income tax filing",
      "tax return",
      "return filing",
      "itr filing",
      "income tax"
    ],
    short: "ITR filing support for individuals and businesses.",
    what: "We help organize your income and deduction details, review the relevant tax information, prepare the return, and guide you through filing.",
    when: "Useful when you need a new return, want help preparing your annual filing, or need support checking the information before submission.",
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Form 16, if applicable",
      "Previous ITR acknowledgement",
      "AIS / Form 26AS",
      "Bank statements",
      "Capital gain statements, if applicable",
      "Investment / deduction proofs, if applicable"
    ],
    steps: [
      "Share your income and tax information",
      "Review the applicable records and deductions",
      "Prepare the tax computation and return",
      "Confirm the details with you",
      "Complete the filing and share the acknowledgement"
    ]
  },

  "Income Tax Notice Assistance": {
    aliases: [
      "income tax notice",
      "tax notice",
      "notice",
      "intimation",
      "scrutiny",
      "demand notice",
      "income tax demand"
    ],
    short: "Support for understanding and responding to income-tax notices.",
    what: "We review the notice, identify what information or response is required, and help prepare the appropriate response or supporting records.",
    when: "Use this service when you receive an income-tax notice, intimation, demand, or other communication that you need help understanding.",
    documents: [
      "Income Tax Notice / Intimation",
      "PAN Card",
      "Previous ITR acknowledgement",
      "Relevant supporting documents",
      "Form 16 / income documents, if applicable",
      "Any earlier response or communication, if available"
    ],
    steps: [
      "Share the complete notice",
      "Review the issue and requested information",
      "Collect the relevant supporting records",
      "Prepare the response / clarification",
      "Submit or guide you on the next action"
    ]
  },

  "GST Registration & Return Filing": {
    aliases: [
      "gst registration",
      "new gst",
      "gst return",
      "gst filing",
      "gstr",
      "gst compliance",
      "gst registration filing"
    ],
    short: "GST registration and regular GST return filing support.",
    what: "We help with GST registration, return preparation, reconciliation of records, and routine GST compliance.",
    when: "Useful for a new business needing GST registration or an existing registered business that needs regular return filing support.",
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Shop Act License, if applicable",
      "Place of Business proof",
      "Address proof",
      "NOC / consent letter if a supporting document is in another person's name",
      "Previous GST registration / return records, if applicable",
      "Bank details, if applicable"
    ],
    steps: [
      "Understand the business and GST requirement",
      "Check registration / filing records",
      "Prepare the required details and supporting documents",
      "Complete the applicable GST work",
      "Share filing / acknowledgement details and next actions"
    ]
  },

  "GST Notice Assistance": {
    aliases: [
      "gst notice",
      "gst demand",
      "gst intimation",
      "gst scrutiny",
      "gst show cause",
      "gst notice reply"
    ],
    short: "Support for reviewing GST notices and preparing responses.",
    what: "We help interpret the GST notice, identify the issue, check relevant returns or invoices, and prepare the next response or supporting explanation.",
    when: "Choose this when you have received a GST notice, demand, scrutiny communication, or show-cause type communication.",
    documents: [
      "GST Notice / communication",
      "GSTIN details",
      "GST return copies",
      "Sales / purchase invoices",
      "Relevant registration documents",
      "Reconciliation or ledger records, if applicable",
      "Previous reply / communication, if available"
    ],
    steps: [
      "Share the complete GST notice",
      "Review the issue and requested response",
      "Check returns and supporting records",
      "Prepare the explanation / reply",
      "Guide you through submission and follow-up"
    ]
  },

  "TDS / TCS Compliance": {
    aliases: [
      "tds",
      "tcs",
      "tds return",
      "tcs return",
      "tan",
      "withholding",
      "tds compliance",
      "tcs compliance"
    ],
    short: "TDS / TCS calculation, statement and compliance support.",
    what: "We help with TDS/TCS records, calculations, challan information, statements, and related compliance activities.",
    when: "Useful for businesses, employers, or other deductors / collectors handling payments where TDS or TCS compliance applies.",
    documents: [
      "TAN details, if applicable",
      "PAN details",
      "TDS / TCS statements or previous filings",
      "Challan details",
      "Salary / payment records",
      "Vendor / party details, if applicable",
      "Previous return details"
    ],
    steps: [
      "Collect payment and deduction / collection records",
      "Review the relevant tax details",
      "Reconcile challans and statements",
      "Prepare the applicable compliance work",
      "Share filing / acknowledgement information"
    ]
  },

  "PF Compliance": {
    aliases: [
      "pf",
      "epf",
      "provident fund",
      "pf compliance",
      "pf return",
      "provident fund return"
    ],
    short: "PF-related employer registration and recurring compliance support.",
    what: "We help maintain the records and payroll inputs needed for applicable PF compliance and filings.",
    when: "Relevant for employers with PF-related registrations and recurring employee compliance requirements.",
    documents: [
      "Employer registration details",
      "PF establishment details",
      "Employee records",
      "Salary / payroll records",
      "Previous PF filing details",
      "Relevant challan / contribution records"
    ],
    steps: [
      "Review employer and employee records",
      "Validate payroll inputs",
      "Prepare the applicable PF compliance work",
      "Review the output",
      "Complete the filing / submission and share the status"
    ]
  },

  "PT Compliance": {
    aliases: [
      "pt",
      "professional tax",
      "professional tax compliance",
      "pt return",
      "professional tax return"
    ],
    short: "Professional Tax registration and filing support.",
    what: "We assist with applicable Professional Tax registration, payroll-related records, and periodic filing requirements.",
    when: "Useful for employers or businesses that have Professional Tax compliance requirements.",
    documents: [
      "Business / employer details",
      "Employee records",
      "Salary details",
      "Professional Tax registration details, if already available",
      "Previous PT filing details"
    ],
    steps: [
      "Review the business and employee details",
      "Check the applicable PT records",
      "Prepare the filing data",
      "Complete the applicable compliance",
      "Share the acknowledgement / next action"
    ]
  },

  "Tax Computation & Planning": {
    aliases: [
      "tax planning",
      "tax saving",
      "tax computation",
      "save tax",
      "tax calculation",
      "tax advice",
      "tax planning advice"
    ],
    short: "Tax computation, planning and deduction guidance.",
    what: "We review your income, available deductions and relevant records to help calculate the tax position and plan the next steps.",
    when: "Useful before filing, when comparing tax options, or when you want to understand the tax impact of income, investments, or other transactions.",
    documents: [
      "PAN Card",
      "Income details",
      "Salary / business income records",
      "Investment / deduction proofs",
      "Loan / interest details, if applicable",
      "Previous ITR, if available",
      "Relevant transaction details"
    ],
    steps: [
      "Collect income and financial information",
      "Review deductions and relevant records",
      "Prepare the tax computation",
      "Discuss the applicable planning options",
      "Confirm the next filing / documentation step"
    ]
  },

  "Accounting & Bookkeeping": {
    aliases: [
      "accounting",
      "bookkeeping",
      "book keeping",
      "accounts",
      "accounting work",
      "books",
      "monthly accounting"
    ],
    short: "Bookkeeping and accounting support for regular business records.",
    what: "We help organize transaction records, maintain books, reconcile information, and support regular accounting and reporting work.",
    when: "Useful when a business needs ongoing bookkeeping, transaction recording, reconciliations, or cleaner financial records.",
    documents: [
      "Bank statements",
      "Sales invoices",
      "Purchase invoices",
      "Expense bills",
      "Receipts and payment details",
      "Previous accounting records",
      "Loan / asset records, if applicable"
    ],
    steps: [
      "Collect the business transaction records",
      "Organize and classify transactions",
      "Reconcile the relevant accounts",
      "Prepare or update the books",
      "Share the accounting status / required follow-up"
    ]
  },

  "Payroll Compliance": {
    aliases: [
      "payroll",
      "salary processing",
      "salary",
      "payroll compliance",
      "employee payroll"
    ],
    short: "Payroll processing and related compliance support.",
    what: "We help organize employee inputs, salary calculations, payroll records, and applicable statutory payroll information.",
    when: "Useful for businesses that need regular salary processing and payroll compliance support.",
    documents: [
      "Employee master data",
      "Salary structure",
      "Attendance / payroll inputs",
      "PF / ESIC / PT details, if applicable",
      "Previous payroll records",
      "Leave / incentive / deduction inputs, if applicable"
    ],
    steps: [
      "Collect employee and monthly payroll inputs",
      "Review salary and deduction information",
      "Prepare the payroll",
      "Check the applicable compliance inputs",
      "Share payroll / compliance outputs"
    ]
  },

  "Project Report Preparation": {
    aliases: [
      "project report",
      "project report preparation",
      "loan project report",
      "dpr",
      "bank project report",
      "loan report"
    ],
    short: "Project reports for financing, business planning and proposals.",
    what: "We prepare structured project reports using your business, cost, revenue and funding information.",
    when: "Useful when you need a project report for a bank, lender, business proposal, or internal planning.",
    documents: [
      "Business profile",
      "Promoter / owner details",
      "Estimated project cost",
      "Revenue projections",
      "Expense assumptions",
      "Loan requirement details",
      "Existing financial information, if available"
    ],
    steps: [
      "Understand the business / project",
      "Collect cost, revenue and funding assumptions",
      "Build the financial projections",
      "Prepare the project report",
      "Review the report with you and finalize it"
    ]
  },

  "Business Plan & Financial Projections": {
    aliases: [
      "business plan",
      "financial projections",
      "financial projection",
      "business projection",
      "startup plan",
      "business plan preparation"
    ],
    short: "Business planning and financial projection support.",
    what: "We structure the business model, assumptions, revenue and cost projections, and funding requirements into a clear plan.",
    when: "Useful for a new venture, expansion, funding proposal, or when you need a clearer financial picture of a business.",
    documents: [
      "Business idea / profile",
      "Promoter details",
      "Revenue assumptions",
      "Cost assumptions",
      "Existing financial information, if available",
      "Funding requirement",
      "Target market / business details, if available"
    ],
    steps: [
      "Understand the business model and objective",
      "Collect financial and operating assumptions",
      "Prepare revenue and cost projections",
      "Build the business plan / projection model",
      "Review the result and finalize it"
    ]
  }
};

const SERVICE_NAMES = Object.keys(SERVICE_KNOWLEDGE);

const SUGGESTIONS = [
  { label: "I need ITR help", value: "I need help with ITR filing." },
  { label: "GST help", value: "I need help with GST registration or filing." },
  { label: "I received a notice", value: "I received a tax notice and need help." },
  { label: "What documents do I need?", value: "What documents do I need?" }
];

function normalize(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s/+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTimeGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hour12: false
    }).format(new Date())
  );

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Hello";
}

function makeBotMessage({
  text,
  title = "",
  service = "",
  documents = [],
  steps = [],
  options = []
}) {
  return {
    id: `bot-${Date.now()}-${Math.random()}`,
    role: "bot",
    text,
    title,
    service,
    documents,
    steps,
    options
  };
}

function makeUserMessage(text) {
  return {
    id: `user-${Date.now()}-${Math.random()}`,
    role: "user",
    text
  };
}

function detectServices(input) {
  const value = normalize(input);

  return SERVICE_NAMES.filter((service) => {
    const data = SERVICE_KNOWLEDGE[service];

    return data.aliases.some((alias) =>
      value.includes(normalize(alias))
    );
  });
}

function findBestService(input, currentService = "") {
  const matches = detectServices(input);

  if (matches.length) {
    return matches[0];
  }

  if (currentService) {
    return currentService;
  }

  const words = normalize(input).split(" ").filter(Boolean);

  const scored = SERVICE_NAMES.map((service) => {
    const searchable = normalize(
      [
        service,
        SERVICE_KNOWLEDGE[service].short,
        SERVICE_KNOWLEDGE[service].what,
        ...SERVICE_KNOWLEDGE[service].aliases
      ].join(" ")
    );

    const score = words.reduce(
      (total, word) =>
        word.length > 2 && searchable.includes(word)
          ? total + 1
          : total,
      0
    );

    return { service, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0
    ? scored[0].service
    : "";
}

function getIntent(input) {
  const value = normalize(input);

  if (/^(hi|hello|hey|namaste|good morning|good afternoon|good evening)[!. ,]*$/.test(value)) {
    return "greeting";
  }

  if (/(whatsapp|message.*whatsapp)/i.test(value)) {
    return "whatsapp";
  }

  if (/(^|\s)(call|phone|telephone|speak to someone)(\s|$)/i.test(value)) {
    return "call";
  }

  if (/(document|documents|paper|papers|proof|proofs|what do i need|need to submit|required documents|requirements)/i.test(value)) {
    return "documents";
  }

  if (/(how.*(file|filing|apply|register|submit)|process|procedure|steps|what happens next|how does it work|how to)/i.test(value)) {
    return "process";
  }

  if (/(what is|what are|explain|meaning|tell me about|details of|about this|what does)/i.test(value)) {
    return "explain";
  }

  if (/(eligible|eligibility|applicable|who needs|when do i need|do i need|is it required|should i)/i.test(value)) {
    return "eligibility";
  }

  if (/(price|pricing|fee|fees|cost|charge|charges|how much|rate|quotation|quote)/i.test(value)) {
    return "pricing";
  }

  if (/(deadline|due date|last date|when is it due|when should i file)/i.test(value)) {
    return "deadline";
  }

  if (/(refund|refund status|claim refund)/i.test(value)) {
    return "refund";
  }

  if (/(notice|intimation|demand|scrutiny|show cause|received.*letter)/i.test(value)) {
    return "notice";
  }

  if (/(help|assist|service|which service|what service|not sure|don't know)/i.test(value)) {
    return "service";
  }

  return "general";
}

function buildGreeting() {
  return {
    text: `${getTimeGreeting()}! 👋 I’m Gore Assist, the accounts & tax assistant for Abhishek Gore & Associates. Tell me what you need in your own words — I’ll identify the service, answer the question, and show the relevant document checklist when useful.`,
    options: SUGGESTIONS
  };
}

function buildServiceReply(service) {
  const data = SERVICE_KNOWLEDGE[service];

  return {
    text: `It looks like **${service}** is the closest match. ${data.short}`,
    title: "Recommended service",
    service,
    options: [
      { label: "What is it?", value: `What is ${service}?` },
      { label: "Documents", value: `What documents are required for ${service}?` },
      { label: "Process", value: `What is the process for ${service}?` },
      { label: "Talk to expert", action: "lead" }
    ]
  };
}

function buildAnswer(input, service, intent) {
  const data = service ? SERVICE_KNOWLEDGE[service] : null;

  if (intent === "greeting") {
    return buildGreeting();
  }

  if (intent === "whatsapp") {
    return {
      text: "I’ve prepared a direct WhatsApp handoff using the context from this chat.",
      options: [
        { label: "Open WhatsApp", action: "whatsapp" },
        { label: "Continue here", value: "I want to continue with my question." }
      ]
    };
  }

  if (intent === "call") {
    return {
      text: "You can speak directly with the team on +91 76660 21252.",
      options: [
        { label: "Call now", action: "call" },
        { label: "Open WhatsApp", action: "whatsapp" }
      ]
    };
  }

  if (!service && ["documents", "process", "explain", "eligibility", "pricing", "deadline", "refund", "notice"].includes(intent)) {
    return {
      text: "I can answer that accurately once I know which service you mean. For example, you can say “ITR documents”, “GST registration process”, “TDS return”, “PF compliance”, or “GST notice”.",
      options: SUGGESTIONS
    };
  }

  if (intent === "documents" && data) {
    return {
      text: `For **${service}**, these are the usual documents / records to keep ready. The final checklist can change based on your case.`,
      title: "Typical documents required",
      service,
      documents: data.documents,
      options: [
        { label: "Explain this service", value: `What is ${service}?` },
        { label: "Show process", value: `What is the process for ${service}?` },
        { label: "Talk to expert", action: "lead" }
      ]
    };
  }

  if (intent === "process" && data) {
    return {
      text: `For **${service}**, the usual workflow is below. The exact steps depend on your case and the records available.`,
      title: "Typical process",
      service,
      steps: data.steps,
      options: [
        { label: "Documents", value: `What documents are required for ${service}?` },
        { label: "Ask about fees", value: `What are the fees for ${service}?` },
        { label: "Talk to expert", action: "lead" }
      ]
    };
  }

  if (intent === "explain" && data) {
    return {
      text: data.what,
      title: `${service}`,
      service,
      options: [
        { label: "When is it needed?", value: `When is ${service} needed?` },
        { label: "Documents", value: `What documents are required for ${service}?` },
        { label: "Process", value: `What is the process for ${service}?` }
      ]
    };
  }

  if (intent === "eligibility" && data) {
    return {
      text: data.when,
      title: `When / who it is for`,
      service,
      options: [
        { label: "Documents", value: `What documents are required for ${service}?` },
        { label: "Process", value: `What is the process for ${service}?` },
        { label: "Talk to expert", action: "lead" }
      ]
    };
  }

  if (intent === "pricing" && data) {
    return {
      text: `The professional fee for **${service}** depends on the scope, volume of records, complexity, and the work required. I don’t want to give you a made-up price. The team can confirm the exact fee after understanding your requirement.`,
      title: "Professional fee",
      service,
      options: [
        { label: "Required documents", value: `What documents are required for ${service}?` },
        { label: "Get exact quote", action: "lead" },
        { label: "WhatsApp team", action: "whatsapp" }
      ]
    };
  }

  if (intent === "deadline" && data) {
    return {
      text: `Filing and compliance due dates can change based on the applicable period, taxpayer / business type, and government updates. I don’t want to give you an outdated date. Tell me the relevant period or connect with the team for the current due date.`,
      title: "Due date guidance",
      service,
      options: [
        { label: "Talk to expert", action: "lead" },
        { label: "WhatsApp team", action: "whatsapp" }
      ]
    };
  }

  if (intent === "refund" && data) {
    return {
      text: `For **${service}**, refund questions normally require checking the filing details, acknowledgement, and the relevant tax records. Share the filing / notice details with the team for case-specific review.`,
      title: "Refund guidance",
      service,
      documents: data.documents.slice(0, 5),
      options: [
        { label: "Talk to expert", action: "lead" },
        { label: "WhatsApp team", action: "whatsapp" }
      ]
    };
  }

  if (intent === "notice" && data) {
    return {
      text: data.what,
      title: `Notice / communication help`,
      service,
      documents: data.documents,
      options: [
        { label: "What is the process?", value: `What is the process for ${service}?` },
        { label: "Talk to expert", action: "lead" },
        { label: "WhatsApp team", action: "whatsapp" }
      ]
    };
  }

  if (data) {
    return {
      text: `${data.what} Here are the typical records to keep ready as well.`,
      title: `${service}`,
      service,
      documents: data.documents,
      options: [
        { label: "Explain", value: `What is ${service}?` },
        { label: "Process", value: `What is the process for ${service}?` },
        { label: "Fees", value: `What are the fees for ${service}?` },
        { label: "Talk to expert", action: "lead" }
      ]
    };
  }

  if (intent === "service") {
    return {
      text: "I can suggest the closest service from your message. Start with ITR, GST, notice assistance, TDS/TCS, PF, PT, accounting, payroll, project report, or business plan.",
      title: "Choose what you need help with",
      options: [
        ...SERVICE_NAMES.slice(0, 6).map((name) => ({
          label: name,
          value: `I need ${name}`
        })),
        { label: "More services", value: "Show all services" }
      ]
    };
  }

  return {
    text: "Tell me a little more about what you need. I can identify the relevant service, explain it, show the document checklist, explain the process, and connect you with the team.",
    options: SUGGESTIONS
  };
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
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
  const startedRef = useRef(false);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping, showLeadForm]);

  const recentUserText = useMemo(() => {
    return messages
      .filter((item) => item.role === "user")
      .slice(-6)
      .map((item) => item.text)
      .join(" ");
  }, [messages]);

  const contextService = selectedService || findBestService(recentUserText);

  const whatsappText = encodeURIComponent(
    [
      "Hello Abhishek Gore & Associates,",
      "",
      contextService
        ? `Service: ${contextService}`
        : "I need help with your services.",
      recentUserText
        ? `My recent query: ${recentUserText.slice(0, 700)}`
        : ""
    ].filter(Boolean).join("\n")
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;
  const callUrl = `tel:${CALL_NUMBER}`;

  const addBotReply = (reply, delay = 320) => {
    setIsTyping(true);

    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        makeBotMessage(reply)
      ]);
    }, delay);
  };

  const openLeadForm = () => {
    setLeadError("");
    setShowLeadForm(true);

    addBotReply(
      {
        text: "Sure. Share your name and phone number. I’ll send the context from this chat to the team so they know what you need.",
        title: "Connect with the team"
      },
      180
    );
  };

  const handleSmartMessage = (rawInput) => {
    const text = rawInput.trim();

    if (!text || isTyping) return;

    setMessages((prev) => [...prev, makeUserMessage(text)]);
    setInput("");

    const intent = getIntent(text);
    const detectedService = findBestService(text, selectedService);

    if (detectedService) {
      setSelectedService(detectedService);
    }

    if (intent === "greeting") {
      addBotReply(buildGreeting());
      return;
    }

    if (intent === "whatsapp") {
      addBotReply(buildAnswer(text, detectedService, intent));
      return;
    }

    if (intent === "call") {
      addBotReply(buildAnswer(text, detectedService, intent));
      return;
    }

      if (intent === "service" && detectedService === "") {
      if (/(all services|list.*services|services do you provide|what services)/i.test(text)) {
        addBotReply({
          text: "We currently support the following services:",
          title: "All services",
          options: SERVICE_NAMES.map((name) => ({
            label: name,
            value: `Tell me about ${name}`
          }))
        });
      } else {
        addBotReply(buildAnswer(text, detectedService, intent));
      }
      return;
    }

    // Important: service-specific question always wins over generic "help/contact".
    addBotReply(buildAnswer(text, detectedService, intent));
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
      .slice(-10)
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
        makeBotMessage({
          text: "Done — your enquiry is with the team. You can keep chatting here or contact us directly.",
          title: "Request sent",
          options: [
            { label: "WhatsApp team", action: "whatsapp" },
            { label: "Call the team", action: "call" }
          ]
        })
      ]);
    } catch (error) {
      console.error("Smart chatbot lead error:", error);
      setLeadError(
        error.message ||
        "Unable to send your request. Please use WhatsApp or call the team."
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
    setMessages([makeBotMessage(buildGreeting())]);
    startedRef.current = true;
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
                  <i /> Smart tax & accounts assistant · 24/7
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
              <span className="smart-chatbot-intro-badge">SMART SERVICE ASSISTANT</span>
              <h3>Ask anything about our services</h3>
              <p>
                Try: “What documents are required for ITR?” or “I received a GST notice.”
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
                      {message.title && (
                        <div className="smart-chatbot-message-title">
                          {message.title}
                        </div>
                      )}

                      {message.service && (
                        <div className="smart-chatbot-service-badge">
                          {message.service}
                        </div>
                      )}

                      {message.text.split("\n").map((line, index) => (
                        <span key={`${message.id}-${index}`}>
                          {line.replace(/^\*\*(.*?)\*\*$/g, "$1")}
                          {index < message.text.split("\n").length - 1 && <br />}
                        </span>
                      ))}

                      {message.documents?.length > 0 && (
                        <div className="smart-chatbot-rich-section">
                          <strong>Keep these ready</strong>
                          <ul>
                            {message.documents.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {message.steps?.length > 0 && (
                        <div className="smart-chatbot-rich-section">
                          <strong>Typical next steps</strong>
                          <ol>
                            {message.steps.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ol>
                        </div>
                      )}
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
                ✓ Your enquiry was sent through the website enquiry system.
              </div>
            )}
          </div>

          <div className="smart-chatbot-composer">
            <div className="smart-chatbot-shortcuts">
              <button
                type="button"
                onClick={() => handleSmartMessage("What documents are required for ITR filing?")}
              >
                ITR documents
              </button>
              <button
                type="button"
                onClick={() => handleSmartMessage("What documents are required for GST registration?")}
              >
                GST documents
              </button>
              <button
                type="button"
                onClick={() => handleSmartMessage("What services do you provide?")}
              >
                Services
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
              General information only. Exact tax / compliance treatment should be confirmed from the current case records.
            </small>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`smart-chatbot-fab ${open ? "active" : ""}`}
        onClick={() => {
          const nextOpen = !open;

          setOpen(nextOpen);

          if (nextOpen && !startedRef.current) {
            startedRef.current = true;
            setMessages([makeBotMessage(buildGreeting())]);
          }

          if (nextOpen) {
            window.setTimeout(() => inputRef.current?.focus(), 150);
          }
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
