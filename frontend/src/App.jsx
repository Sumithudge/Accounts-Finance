import { useEffect, useState } from "react";
import "./styles.css";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";
import Chatbot from "./Chatbot";

const services = [
  {
    icon: "▤",
    title: "Income Tax & ITR",
    text: "ITR Filing, Tax Planning, Assessment, Refunds & Advisory Services."
  },
  {
    icon: "GST",
    title: "GST Services",
    text: "GST Registration, Return Filing, Reconciliation, Advisory & Compliance."
  },
  {
    icon: "✓",
    title: "Tax Compliance",
    text: "TDS/TCS, PT, PF, Statutory Compliances & Regular Filings."
  },
  {
    icon: "↗",
    title: "Accounting & Financial Services",
    text: "Book Keeping, Financial Statements, Payroll & MIS Reports."
  }
];

const allServices = [
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

const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://accounts-finance.vercel.app")
).replace(/\/$/, "");

function App() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    services: [],
    message: ""
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewAverage, setReviewAverage] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [reviewForm, setReviewForm] = useState({
    name: "",
    service: "",
    rating: 5,
    review: ""
  });

  const [adminLoggedIn, setAdminLoggedIn] =
    useState(
      Boolean(localStorage.getItem("adminToken"))
    );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reviews`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load reviews");
        }

        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setReviewAverage(Number(data.average || 0));
      } catch (error) {
        console.error("Review loading error:", error);
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (window.location.pathname === "/admin") {

    if (!adminLoggedIn) {
      return (
        <AdminLogin
          onLogin={() =>
            setAdminLoggedIn(true)
          }
        />
      );
    }

    return (
      <Admin
        onLogout={() =>
          setAdminLoggedIn(false)
        }
      />
    );
  }
  const chooseService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services
        : [...prev.services, service]
    }));

    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleService = (service) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;

    setReviewForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitReview = async (event) => {
    event.preventDefault();

    setReviewSubmitting(true);
    setReviewSent(false);
    setReviewError("");

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: reviewForm.name,
          service: reviewForm.service,
          rating: Number(reviewForm.rating),
          review: reviewForm.review
        })
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to submit your review"
        );
      }

      setReviewSent(true);
      setReviewForm({
        name: "",
        service: "",
        rating: 5,
        review: ""
      });
    } catch (error) {
      console.error("Review submission error:", error);

      setReviewError(
        error.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSent(false);

    try {
      const apiUrl = API_URL;

      const response = await fetch(
        `${apiUrl}/api/enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      setSent(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        services: [],
        message: ""
      });
    } catch (error) {
      console.error(error);

      alert(
        "Unable to submit enquiry. Please try again. If the problem continues, contact us on WhatsApp or by phone."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="container nav">

          <a href="#home" className="brand">

            <img
        src="/images/logo.png"
        alt="Abhishek Gore & Associates"
        className="header-logo"
      />

            <div>
              <div className="brand-name">
                Abhishek Gore & Associates
              </div>

              <div className="brand-line">
                TAX CONSULTANT
              </div>
            </div>

          </a>

          <nav className="navigation">

            <a className="active" href="#home">
              Home
            </a>

            <a href="#about">
              About Us
            </a>

            <a href="#services">
              Services
            </a>

            <a href="#resources">
              Resources
            </a>

            <a href="#reviews">
              Reviews
            </a>

            <a href="#contact">
              Contact Us
            </a>

          </nav>

          <a
            href="#contact"
            className="nav-button"
          >
            ▣ &nbsp; Get Consultation
            <span>→</span>
          </a>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section
        id="home"
        className="hero"
      >

        <div className="container hero-content">

          {/* LEFT */}

          <div className="hero-left">

            <div className="eyebrow">
              YOUR TRUSTED PARTNER IN TAX & COMPLIANCE
            </div>

            <h1>
              Abhishek Gore &<br />
              Associates
            </h1>

            <div className="hero-title-line">

              <span></span>

              TAX CONSULTANT

              <span></span>

            </div>

            <p className="hero-text">
              Professional Tax & Compliance Solutions
              <br />
              for Individuals and Businesses.
            </p>

            <div className="hero-buttons">

              <a
                href="#contact"
                className="gold-button"
              >
                ▣ &nbsp; Get Consultation
                <span>→</span>
              </a>

              <a
                href="#services"
                className="outline-button"
              >
                Our Services
                <span>→</span>
              </a>

            </div>

            <div className="hero-tags">

              <span>INCOME TAX</span>

              <i>|</i>

              <span>GST</span>

              <i>|</i>

              <span>TAX COMPLIANCE</span>

              <i>|</i>

              <span>
                ACCOUNTING & FINANCIAL SERVICES
              </span>

            </div>

          </div>


          {/* RIGHT IMAGE */}



        </div>

      </section>


      {/* ================= SERVICES ================= */}

      <section
        id="services"
        className="services-section"
      >

        <div className="container">

          <div className="section-heading">

            <div className="gold-heading">

              <span></span>

              OUR SERVICES

              <span></span>

            </div>

            <h2>
              Comprehensive Tax & Financial Solutions
            </h2>

            <p>
              We help you stay compliant, save tax and achieve
              your financial goals.
            </p>

          </div>


          <div className="service-grid">

            {services.map((service) => (

              <div
                className="service-card"
                key={service.title}
              >

                <div className="service-icon">
                  {service.icon}
                </div>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.text}
                </p>

                <button
                  className="learn-button"
                  onClick={() =>
                    chooseService(service.title)
                  }
                >
                  Learn More
                  <span>→</span>
                </button>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= WHY CHOOSE US ================= */}

      <section
        id="about"
        className="why-section"
      >

        <div className="why-dark">

          <div className="why-icon">
            ♧
          </div>

          <div>

            <div className="why-small">
              Why Choose Us
            </div>

            <h2>
              Your Growth is Our Priority
            </h2>

            <p>
              We combine expertise, technology and a
              client-first approach to deliver trusted
              and reliable tax solutions.
            </p>

          </div>

        </div>


        <div className="why-items">

          <div className="why-item">

            <div className="why-item-icon">
              ✓
            </div>

            <div>

              <h4>
                Professional & Reliable Service
              </h4>

              <p>
                Accurate advice, dedicated support and
                complete confidentiality.
              </p>

            </div>

          </div>


          <div className="why-item">

            <div className="why-item-icon">
              ◷
            </div>

            <div>

              <h4>
                Timely Compliance
              </h4>

              <p>
                We ensure you never miss a deadline,
                so you stay stress-free.
              </p>

            </div>

          </div>


          <div className="why-item">

            <div className="why-item-icon">
              ♙
            </div>

            <div>

              <h4>
                Individual & Business Tax Solutions
              </h4>

              <p>
                Personalized solutions for individuals,
                startups and established businesses.
              </p>

            </div>

          </div>


          <div className="why-item">

            <div className="why-item-icon">
              ↗
            </div>

            <div>

              <h4>
                Direct & Indirect Tax Support
              </h4>

              <p>
                Expert guidance in Income Tax, GST and
                other compliances.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ALL SERVICES ================= */}

      <section
        className="full-services"
        id="resources"
      >

        <div className="container">

          <div className="section-heading">

            <div className="gold-heading">

              <span></span>

              ALL SERVICES

              <span></span>

            </div>

            <h2>
              Everything You Need in One Place
            </h2>

            <p>
              Tax, GST, PF, accounting and compliance
              services for individuals and businesses.
            </p>

          </div>


          <div className="full-service-grid">

            {allServices.map((service) => (

              <button
                type="button"
                className="service-pill"
                key={service}
                onClick={() =>
                  chooseService(service)
                }
              >

                <span>
                  ✓
                </span>

                {service}

                <b>
                  →
                </b>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ================= REVIEWS ================= */}

      <section
        id="reviews"
        className="reviews-section"
      >
        <div className="container">

          <div className="section-heading">
            <div className="gold-heading">
              <span></span>
              CLIENT REVIEWS
              <span></span>
            </div>

            <h2>
              Trusted by Our Clients
            </h2>

            <p>
              Real feedback from clients who have used our tax,
              <br />
              compliance, accounting and financial services.
            </p>
          </div>

          <div className="reviews-summary">
            <div className="reviews-score-card">
              <strong>
                {reviewAverage > 0 ? reviewAverage.toFixed(1) : "—"}
              </strong>

              <div className="reviews-stars" aria-label="Average client rating">
                {"★".repeat(Math.round(reviewAverage || 0))}
                {"☆".repeat(Math.max(0, 5 - Math.round(reviewAverage || 0)))}
              </div>

              <span>
                {reviews.length} approved client review{reviews.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="reviews-summary-copy">
              <strong>Share your experience</strong>
              <p>
                Clients can rate our service from 1 to 5 stars and leave a
                review. New reviews are checked by our team before appearing
                publicly.
              </p>
            </div>
          </div>

          {reviewLoading ? (
            <div className="reviews-empty">
              Loading client reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="reviews-empty">
              No approved reviews yet. Be one of our first clients to share
              your experience.
            </div>
          ) : (
            <div className="reviews-grid">
              {reviews.map((item) => (
                <article
                  className="review-card"
                  key={item._id}
                >
                  <div className="review-card-top">
                    <div className="review-avatar">
                      {String(item.name || "C").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.service}</span>
                    </div>
                  </div>

                  <div
                    className="review-card-stars"
                    aria-label={item.rating + " out of 5 stars"}
                  >
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </div>

                  <p>
                    “{item.review}”
                  </p>

                  <small>
                    Client review published by Abhishek Gore & Associates
                  </small>
                </article>
              ))}
            </div>
          )}

          <div className="review-form-card">
            <div className="review-form-intro">
              <span>CLIENT FEEDBACK</span>
              <h3>How was your experience?</h3>
              <p>
                Tell us what service you used and rate your experience.
                <br />
                Please submit feedback only if you have actually received our service.
              </p>
            </div>

            <form onSubmit={submitReview} className="review-form">

              <div className="review-form-row">

                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={reviewForm.name}
                    placeholder="Enter your name"
                    onChange={handleReviewChange}
                  />
                </div>

                <div className="form-group">
                  <label>Service Used *</label>
                  <select
                    required
                    name="service"
                    value={reviewForm.service}
                    onChange={handleReviewChange}
                  >
                    <option value="">Select a service</option>
                    {allServices.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="review-rating-field">
                <label>Your Rating *</label>

                <div className="review-rating-picker">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      className={"review-star-button " + (Number(reviewForm.rating) >= value ? "selected" : "")}
                      onClick={() =>
                        setReviewForm((prev) => ({
                          ...prev,
                          rating: value
                        }))
                      }
                      aria-label={"Give " + value + " out of 5 stars"}
                    >
                      ★
                    </button>
                  ))}
                  <span>
                    {reviewForm.rating}/5
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Review *</label>
                <textarea
                  required
                  rows="5"
                  name="review"
                  value={reviewForm.review}
                  placeholder="Tell us about your experience..."
                  onChange={handleReviewChange}
                />
              </div>

              {reviewError && (
                <div className="review-form-error">
                  {reviewError}
                </div>
              )}

              {reviewSent && (
                <div className="review-form-success">
                  Thank you! Your review has been submitted and will appear after our team approves it.
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting Review..." : "Submit Review"}
                {!reviewSubmitting && <span>→</span>}
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* ================= CONTACT ================= */}

      <section
        id="contact"
        className="contact-section"
      >

        <div className="container contact-grid">


          {/* CONTACT INFORMATION */}

          <div className="contact-info">

            <div className="gold-heading left">

              <span></span>

              GET IN TOUCH

            </div>

            <h2>
              Let's Discuss Your
              <br />

              <span>
                Tax & Compliance Needs
              </span>

            </h2>

            <p>
              Tell us what you need help with.
              Our team will get back to you shortly.
            </p>


            <div className="contact-detail">

              <strong>
                ☎
              </strong>

              <div>

                <small>
                  Call Us
                </small>

                <p>
                  +91 76660 21252
                </p>

              </div>

            </div>


            <div className="contact-detail">

              <strong>
                ✉
              </strong>

              <div>

                <small>
                  Email Us
                </small>

                <p>
                  abhishekgore9612@gmail.com
                </p>

              </div>

            </div>


            <div className="contact-detail">

              <strong>
                ⌖
              </strong>

              <div>

                <small>
                  Office
                </small>

                <p>
                  Pune & Paranda Maharashtra
                </p>

              </div>

            </div>

          </div>


          {/* FORM */}

          <div className="contact-card">

            <h3>
              Request a Consultation
            </h3>

            <p>
              Fill in your details and we'll contact you.
            </p>


            {sent && (

              <div className="success-message">
                Thank you! Your enquiry has been submitted successfully.
              </div>

            )}


            <form onSubmit={submitForm}>


              {/* NAME + PHONE */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Your Name *
                  </label>

                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    placeholder="Enter your name"
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    placeholder="+91 98765 43210"
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={handleChange}
                />

              </div>


              {/* SERVICES */}

              <div className="form-group">

                <label>
                  What services do you need?
                </label>


                <div className="form-services">

                  {allServices.map((service) => (

                    <label
                      className={`form-service ${
                        form.services.includes(service)
                          ? "selected"
                          : ""
                      }`}
                      key={service}
                    >

                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() =>
                          toggleService(service)
                        }
                      />

                      <span>
                        {service}
                      </span>

                    </label>

                  ))}

                </div>

              </div>


              {/* MESSAGE */}

              <div className="form-group">

                <label>
                  Tell us more
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  placeholder="Tell us about your requirement..."
                  onChange={handleChange}
                />

              </div>


              {/* SUBMIT */}

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Enquiry"
                }

                {!loading && (
                  <span>
                    →
                  </span>
                )}

              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="container footer-grid">


          <div className="footer-brand">

             <img
        src="/images/logo.png"
        alt="Abhishek Gore & Associates"
        className="footer-logo"
      />


            <div>

              <strong>
                Abhishek Gore & Associates
              </strong>

              <small>
                TAX CONSULTANT
              </small>

            </div>

          </div>


          <div className="footer-contact">

            <span>
              ☎
            </span>

            +91 76660 21252

          </div>


          <div className="footer-contact">

            <span>
              ✉
            </span>

            abhishekgore9612@gmail.com

          </div>


          <div className="footer-contact">

            <span>
              ⌖
            </span>

            Pune & Paranda Maharashtra

          </div>


          <div className="socials">

            <a href="#" aria-label="LinkedIn">
              in
            </a>

            <a href="#" aria-label="WhatsApp">
              ◉
            </a>

            <a href="#" aria-label="Phone">
              ☎
            </a>

          </div>

        </div>

      </footer>

    <Chatbot />

    </div>
  );
}

export default App;