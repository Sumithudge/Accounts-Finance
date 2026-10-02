import { useEffect, useState } from "react";
import "./admin.css"; 

function Admin({ onLogout }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      </main>

    </div>
  );
}

export default Admin;