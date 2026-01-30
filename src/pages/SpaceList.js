import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces, updateSpace } from "../services/api";

const AUTO_RELEASE_MINUTES = 120;

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

        const refreshed =
          expiredSpaces.length > 0 ? await getSpaces() : data;

        setSpaces(refreshed);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tick]);

  async function handleBookSpace(spaceId) {
    if (!userId) {
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
      alert("Failed to book space");
    }
  }

  async function handleCancelBooking(spaceId) {
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

  return (
    <>
      <div className="page-header">
        <h2>Study Spaces</h2>
        <p>Browse and book available study areas across campus</p>
      </div>

      <div className="car-list-page">
        <div className="container">
          <div className="car-grid">
            {spaces.map((space) => {
              const timeLeft =
                !space.is_available && space.booking_time
                  ? formatRemaining(space.booking_time)
                  : null;

              const displayBookingTime =
                !space.is_available && space.booking_time
                  ? parseAsLocal(space.booking_time)?.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
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
