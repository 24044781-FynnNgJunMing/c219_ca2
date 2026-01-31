import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces, updateSpace } from "../services/api";

const AUTO_RELEASE_MINUTES = 120;

const ZONE_TYPES = ["Quiet", "Discussion"];

function parseAsLocal(bookingTime) {
  if (!bookingTime) return null;
  return new Date(bookingTime);
}

function isBookingExpired(bookingTime) {
  const d = parseAsLocal(bookingTime);
  if (!d || Number.isNaN(d.getTime())) return false;
  return Date.now() - d.getTime() >= AUTO_RELEASE_MINUTES * 60 * 1000;
}

function formatRemaining(bookingTime) {
  const d = parseAsLocal(bookingTime);
  if (!d || Number.isNaN(d.getTime())) return null;

  const endMs = d.getTime() + AUTO_RELEASE_MINUTES * 60 * 1000;
  const diffMs = endMs - Date.now();

  if (diffMs <= 0) return "Expired";

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function SpaceList() {
  const [spaces, setSpaces] = useState("");
  const [tick, setTick] = useState(0);

  // 🔹 filter state
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [hoveredFilter, setHoveredFilter] = useState(null);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSpaces();

        const expiredSpaces = data.filter(
          (s) =>
            !s.is_available &&
            s.booking_time &&
            isBookingExpired(s.booking_time)
        );

        for (const s of expiredSpaces) {
          await updateSpace(s.id, {
            is_available: 1,
            booked_by: null,
            booking_time: null,
          });
        }

        const refreshed = expiredSpaces.length > 0 ? await getSpaces() : data;
        setSpaces(refreshed);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tick]);

  async function handleBookSpace(spaceId) {
    if (!token || !userId) {
      alert("Please log in to book a space");
      return;
    }

    try {
      const now = new Date().toISOString();

      await updateSpace(spaceId, {
        is_available: 0,
        booked_by: Number(userId),
        booking_time: now,
      });

      const refreshed = await getSpaces();
      setSpaces(refreshed);
    } catch (error) {
      console.error(error);
      alert("Failed to book space");
    }
  }

  async function handleCancelBooking(spaceId) {
    if (!token || !userId) {
      alert("Please log in");
      return;
    }

    const ok = window.confirm("Cancel this booking?");
    if (!ok) return;

    try {
      await updateSpace(spaceId, {
        is_available: 1,
        booked_by: null,
        booking_time: null,
      });

      const refreshed = await getSpaces();
      setSpaces(refreshed);
    } catch (error) {
      console.error(error);
      alert("Failed to cancel booking");
    }
  }

  if (spaces === "") {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading study spaces...</p>
      </div>
    );
  }

  // 🔹 Apply filters
  const filteredSpaces = spaces.filter((space) => {
    // availability filter
    if (availabilityFilter === "available" && !space.is_available) {
      return false;
    }
    if (availabilityFilter === "booked" && space.is_available) {
      return false;
    }

    // zone type filter
    if (zoneFilter !== "all" && space.zone_type !== zoneFilter) {
      return false;
    }

    // capacity filter
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
          {/* 🔹 FILTERS (with hover on each control) */}
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "0.75rem",
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
                  {ZONE_TYPES.map((zone) => (
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

            {filteredSpaces.map((space) => {
              const timeLeft =
                !space.is_available && space.booking_time
                  ? formatRemaining(space.booking_time)
                  : null;

              const displayBookingTime =
                !space.is_available && space.booking_time
                  ? parseAsLocal(space.booking_time)?.toLocaleString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )
                  : null;

              const isOwner =
                userRole !== "admin" &&
                userId &&
                Number(userId) === Number(space.booked_by);

              return (
                <div key={space.id} className="car-card">
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

                    <div className="space-meta">
                      <span className="zone-badge">{space.zone_type}</span>
                      <span
                        className={`status-badge ${
                          space.is_available
                            ? "status-available"
                            : "status-booked"
                        }`}
                      >
                        {space.is_available ? "● Available" : "● Booked"}
                      </span>
                    </div>

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
                    </div>

                    <div className="booking-info">
                      {!space.is_available ? (
                        <>
                          <div className="booking-detail">
                            <span className="booking-label">Student ID</span>
                            <span className="booking-value">
                              {space.booked_by}
                            </span>
                          </div>

                          {displayBookingTime && (
                            <div className="booking-detail">
                              <span className="booking-label">Booked at</span>
                              <span className="booking-value">
                                {displayBookingTime}
                              </span>
                            </div>
                          )}

                          {timeLeft && (
                            <div className="time-remaining">
                              <span>{timeLeft} remaining</span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="booking-info-placeholder">—</div>
                      )}
                    </div>

                    <div className="car-actions">
                      {userRole === "admin" ? (
                        <Link
                          to={`/spaces/${space.id}/edit`}
                          className="btn btn-primary"
                        >
                          Edit Space
                        </Link>
                      ) : !token ? (
                        <Link to="/login" className="btn btn-outline">
                          Login to Book
                        </Link>
                      ) : space.is_available ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleBookSpace(space.id)}
                        >
                          Book Space
                        </button>
                      ) : isOwner ? (
                        <button
                          className="btn btn-outline"
                          onClick={() => handleCancelBooking(space.id)}
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <button className="btn btn-outline" disabled>
                          Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
