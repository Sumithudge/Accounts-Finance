import { useEffect, useState } from "react";
import "./admin.css"; 

function Admin({ onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");

  const fetchReviews = async () => {
    setReviewsLoading(true);
    setReviewError("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        onLogout();
        return;
      }

      const response = await fetch(
        "https://accounts-finance.vercel.app/api/reviews/admin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        onLogout();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Unable to load reviews");
      }

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (error) {
      console.error("Error loading reviews:", error);

      setReviewError(
        error.message || "Unable to load reviews."
      );
    } finally {
      setReviewsLoading(false);
    }
  };

  const updateReview = async (id, approved) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `https://accounts-finance.vercel.app/api/reviews/${id}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ approved })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update review"
        );
      }

      setReviews((prev) =>
        prev.map((review) =>
          review._id === id
            ? { ...review, approved }
            : review
        )
      );
    } catch (error) {
      console.error("Review update error:", error);
      setReviewError(
        error.message || "Unable to update review."
      );
    }
  };

  const deleteReview = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `https://accounts-finance.vercel.app/api/reviews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete review"
        );
      }

      setReviews((prev) =>
        prev.filter((review) => review._id !== id)
      );
    } catch (error) {
      console.error("Review delete error:", error);
      setReviewError(
        error.message || "Unable to delete review."
      );
    }
  };

  const fetchEnquiries = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      console.log("Admin token:", token);

      if (!token) {
        console.log("No admin token found");
        onLogout();
        return;
      }

      const response = await fetch(
  "https://accounts-finance.vercel.app/api/enquiries",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      console.log("Admin API response:", data);

      if (response.status === 401) {
        localStorage.removeItem("adminToken");

        setError("Your login session has expired.");

        setTimeout(() => {
          onLogout();
        }, 1000);

        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load enquiries"
        );
      }

      setEnquiries(
        Array.isArray(data)
          ? data
          : data.enquiries || []
      );

    } catch (error) {
      console.error(
        "Error loading enquiries:",
        error
      );

      setError(
        error.message ||
        "Unable to load enquiries."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    fetchReviews();
  }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  return (
    <div className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <div className="admin-header-left">

          <img
        src="./images/logo.png"
        alt="Abhishek Gore & Associates"
        className="header-logo"
      />

          <div>
            <h2>
              Abhishek Gore & Associates
            </h2>

            <span>
              ADMIN PANEL
            </span>
          </div>

        </div>

        <div className="admin-header-actions">

          <button
            onClick={fetchEnquiries}
            className="admin-refresh-button"
          >
            ↻ Refresh
          </button>

          <a
            href="/"
            className="admin-website-button"
          >
            ← Website
          </a>

          <button
            onClick={logout}
            className="admin-logout-button"
          >
            Logout
          </button>

        </div>

      </header>


      {/* CONTENT */}

      <main className="admin-content">

        <div className="admin-title-row">

          <div>

            <div className="admin-section-label">
              ADMINISTRATION
            </div>

            <h1>
              Customer Enquiries
            </h1>

            <p>
              View enquiries submitted from your website.
            </p>

          </div>

          <div className="admin-count">

            <strong>
              {enquiries.length}
            </strong>

            <span>
              Total Enquiries
            </span>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="admin-error">
            <strong>Error:</strong> {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div className="admin-empty-card">
            <div className="admin-loading">
              Loading enquiries...
            </div>
          </div>
        )}


        {/* NO ENQUIRIES */}

        {!loading &&
          !error &&
          enquiries.length === 0 && (

            <div className="admin-empty-card">

              <div className="admin-empty-icon">
                ✉
              </div>

              <h2>
                No enquiries yet
              </h2>

              <p>
                Customer enquiries will appear here
                when someone submits the consultation form.
              </p>

            </div>
          )}


        {/* ENQUIRIES */}

        {!loading &&
          !error &&
          enquiries.length > 0 && (

            <div className="admin-enquiries">

              {enquiries.map((enquiry) => (

                <div
                  className="enquiry-card"
                  key={enquiry._id}
                >

                  <div className="enquiry-header">

                    <div>

                      <h2>
                        {enquiry.name}
                      </h2>

                      <span className="enquiry-status">
                        {enquiry.status || "new"}
                      </span>

                    </div>

                    <small>
                      {enquiry.createdAt
                        ? new Date(
                            enquiry.createdAt
                          ).toLocaleString()
                        : ""}
                    </small>

                  </div>


                  <div className="enquiry-details">

                    <div>

                      <label>
                        Phone
                      </label>

                      <a
                        href={`tel:${enquiry.phone}`}
                      >
                        {enquiry.phone}
                      </a>

                    </div>


                    <div>

                      <label>
                        Email
                      </label>

                      {enquiry.email ? (

                        <a
                          href={`mailto:${enquiry.email}`}
                        >
                          {enquiry.email}
                        </a>

                      ) : (

                        <span>
                          Not provided
                        </span>

                      )}

                    </div>

                  </div>


                  <div className="enquiry-services">

                    <label>
                      Services
                    </label>

                    <div className="service-tags">

                      {Array.isArray(
                        enquiry.services
                      ) ? (

                        enquiry.services.map(
                          (service, index) => (

                            <span
                              key={`${service}-${index}`}
                            >
                              {service}
                            </span>

                          )
                        )

                      ) : (

                        <span>
                          {enquiry.service ||
                            "Not specified"}
                        </span>

                      )}

                    </div>

                  </div>


                  {enquiry.message && (

                    <div className="enquiry-message">

                      <label>
                        Message
                      </label>

                      <p>
                        {enquiry.message}
                      </p>

                    </div>

                  )}


                  <div className="enquiry-actions">

                    <a
                      href={`tel:${enquiry.phone}`}
                    >
                      ☎ Call Customer
                    </a>

                    {enquiry.email && (

                      <a
                        href={`mailto:${enquiry.email}`}
                      >
                        ✉ Email Customer
                      </a>

                    )}

                    <a
                      href={`https://wa.me/${String(
                        enquiry.phone
                      ).replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp
                    </a>

                  </div>

                </div>

              ))}

            </div>
          )}


        {/* REVIEWS */}

        <section className="admin-reviews-section">

          <div className="admin-title-row admin-subsection-title">
            <div>
              <div className="admin-section-label">CLIENT FEEDBACK</div>
              <h2>Reviews</h2>
              <p>Approve genuine client feedback before it appears on the public website.</p>
            </div>

            <div className="admin-count">
              <strong>{reviews.filter((review) => !review.approved).length}</strong>
              <span>Pending Reviews</span>
            </div>
          </div>

          {reviewError && (
            <div className="admin-error">
              <strong>Review error:</strong> {reviewError}
            </div>
          )}

          {reviewsLoading ? (
            <div className="admin-empty-card">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="admin-empty-card">
              <div className="admin-empty-icon">★</div>
              <h2>No client reviews yet</h2>
              <p>New ratings and reviews submitted from the website will appear here.</p>
            </div>
          ) : (
            <div className="admin-reviews-grid">
              {reviews.map((review) => (
                <article className="admin-review-card" key={review._id}>
                  <div className="admin-review-top">
                    <div>
                      <h3>{review.name}</h3>
                      <span>{review.service}</span>
                    </div>

                    <div className="admin-review-status">
                      {review.approved ? "Published" : "Pending"}
                    </div>
                  </div>

                  <div className="admin-review-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                    <strong>{review.rating}/5</strong>
                  </div>

                  <p className="admin-review-text">
                    {review.review}
                  </p>

                  <small>
                    {review.createdAt ? new Date(review.createdAt).toLocaleString() : ""}
                  </small>

                  <div className="admin-review-actions">
                    <button
                      type="button"
                      className={review.approved ? "review-hide-button" : "review-approve-button"}
                      onClick={() => updateReview(review._id, !review.approved)}
                    >
                      {review.approved ? "Hide Review" : "Approve Review"}
                    </button>

                    <button
                      type="button"
                      className="review-delete-button"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </section>
      </main>

    </div>
  );
}

export default Admin;