import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces } from "../services/api";

export default function SpaceList() {
  const [spaces, setSpaces] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [hoveredFilter, setHoveredFilter] = useState(null); // 👈 NEW: track which filter is hovered

  useEffect(() => {
    getSpaces()
      .then((data) => {
        setSpaces(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (spaces === "") {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading study spaces...</p>
      </div>
    );
  }

  if (spaces.length === 0) {
    return (
      <>
        <div className="page-header">
          <h2>Study Spaces</h2>
          <p>Browse and manage available study areas</p>
        </div>

        <div className="empty-state container">
          <h3>No Study Spaces Available</h3>
          <p>Get started by adding your first study space</p>
          <Link to="/spaces/new" className="btn btn-primary">
            Add Study Space
          </Link>
        </div>
      </>
    );
  }

  // Build zone options dynamically
  const zoneOptions = Array.from(
    new Set(spaces.map((s) => s.zone_type))
  ).filter(Boolean);

  // Apply filters
  const filteredSpaces = spaces.filter((space) => {
    if (availabilityFilter === "available" && !space.is_available) {
      return false;
    }
    if (availabilityFilter === "booked" && space.is_available) {
      return false;
    }

    if (zoneFilter !== "all" && space.zone_type !== zoneFilter) {
      return false;
    }

    if (capacityFilter === "small" && space.capacity > 2) {
      return false;
    }
    if (
      capacityFilter === "medium" &&
      !(space.capacity >= 3 && space.capacity <= 5)
    ) {
      return false;
    }
    if (capacityFilter === "large" && space.capacity < 6) {
      return false;
    }

    return true;
  });

  return (
    <>
      <div className="page-header">
        <h2>Study Spaces</h2>
        <p>Browse and book available study areas across campus</p>
      </div>

      <div className="car-list-page">
        <div className="container">
          {/* 🔹 FILTERS */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "0.75rem",
              backgroundColor: "#f7f7f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Filters
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "flex-end",
              }}
            >
              {/* Availability */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  Availability
                </label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  onMouseEnter={() => setHoveredFilter("availability")}
                  onMouseLeave={() => setHoveredFilter(null)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.4rem",
                    border: "1px solid #ccc",
                    fontSize: "0.9rem",
                    minWidth: "140px",
                    transition: "all 0.2s ease",
                    boxShadow:
                      hoveredFilter === "availability"
                        ? "0 6px 14px rgba(0,0,0,0.15)"
                        : "0 1px 3px rgba(0,0,0,0.06)",
                    transform:
                      hoveredFilter === "availability"
                        ? "translateY(-2px)"
                        : "translateY(0)",
                  }}
                >
                  <option value="all">All</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>

              {/* Zone Type */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  Zone Type
                </label>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  onMouseEnter={() => setHoveredFilter("zone")}
                  onMouseLeave={() => setHoveredFilter(null)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.4rem",
                    border: "1px solid #ccc",
                    fontSize: "0.9rem",
                    minWidth: "160px",
                    transition: "all 0.2s ease",
                    boxShadow:
                      hoveredFilter === "zone"
                        ? "0 6px 14px rgba(0,0,0,0.15)"
                        : "0 1px 3px rgba(0,0,0,0.06)",
                    transform:
                      hoveredFilter === "zone"
                        ? "translateY(-2px)"
                        : "translateY(0)",
                  }}
                >
                  <option value="all">All</option>
                  {zoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Capacity */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  Capacity
                </label>
                <select
                  value={capacityFilter}
                  onChange={(e) => setCapacityFilter(e.target.value)}
                  onMouseEnter={() => setHoveredFilter("capacity")}
                  onMouseLeave={() => setHoveredFilter(null)}
                  style={{
                    padding: "0.4rem 0.6rem",
                    borderRadius: "0.4rem",
                    border: "1px solid #ccc",
                    fontSize: "0.9rem",
                    minWidth: "160px",
                    transition: "all 0.2s ease",
                    boxShadow:
                      hoveredFilter === "capacity"
                        ? "0 6px 14px rgba(0,0,0,0.15)"
                        : "0 1px 3px rgba(0,0,0,0.06)",
                    transform:
                      hoveredFilter === "capacity"
                        ? "translateY(-2px)"
                        : "translateY(0)",
                  }}
                >
                  <option value="all">All</option>
                  <option value="small">1–2 people</option>
                  <option value="medium">3–5 people</option>
                  <option value="large">6+ people</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                type="button"
                onClick={() => {
                  setAvailabilityFilter("all");
                  setZoneFilter("all");
                  setCapacityFilter("all");
                }}
                onMouseEnter={() => setHoveredFilter("clear")}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  padding: "0.45rem 0.8rem",
                  borderRadius: "0.4rem",
                  border: "1px solid #bbb",
                  backgroundColor: "#fff",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow:
                    hoveredFilter === "clear"
                      ? "0 6px 14px rgba(0,0,0,0.15)"
                      : "0 1px 3px rgba(0,0,0,0.06)",
                  transform:
                    hoveredFilter === "clear"
                      ? "translateY(-2px)"
                      : "translateY(0)",
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* 🔹 CARDS */}
          <div className="car-grid">
            {filteredSpaces.length === 0 && (
              <p>No spaces match the selected filters.</p>
            )}

            {filteredSpaces.map((space) => (
              <div key={space.space_id} className="car-card">
                <div className="car-image-container">
                  {space.space_image ? (
                    <img src={space.space_image} alt={space.space_name} />
                  ) : (
                    <div className="car-image-placeholder">
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                <div className="car-details">
                  <h3 className="car-name">{space.space_name}</h3>

                  <span className="car-brand">{space.zone_type} Zone</span>

                  <div className="car-info">
                    <div className="info-item">
                      <span className="info-label">Location</span>
                      <span className="info-value">{space.location}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Capacity</span>
                      <span className="info-value">
                        {space.capacity}{" "}
                        {space.capacity === 1 ? "Person" : "People"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className="info-value">
                        {space.is_available ? "Available" : "Booked"}
                      </span>
                    </div>
                  </div>

                  {!space.is_available && space.booking_time && (
                    <p className="car-description">
                      <strong>Booking Time:</strong>{" "}
                      {new Date(space.booking_time).toLocaleString()}
                    </p>
                  )}

                  <div className="car-actions">
                    <Link
                      to={`/spaces/${space.space_id}/edit`}
                      className="btn btn-primary"
                    >
                      Edit Space
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
