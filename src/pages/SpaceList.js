import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces, updateSpace } from "../services/api";

const AUTO_RELEASE_MINUTES = 120;

function parseAsLocal(bookingTime) {
  if (!bookingTime) return null;
  return new Date(String(bookingTime).replace("Z", ""));
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

  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export default function SpaceList() {
  const [spaces, setSpaces] = useState("");
  const [tick, setTick] = useState(0);

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
            (s.is_available === 0 || s.is_available === false) &&
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

        if (expiredSpaces.length > 0) {
          const refreshed = await getSpaces();
          setSpaces(refreshed);
        } else {
          setSpaces(data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
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
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : null;

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
                          {space.is_available ? (
                            <span style={{ color: "var(--status-available)" }}>
                              Available
                            </span>
                          ) : (
                            <span style={{ color: "var(--status-booked)" }}>
                              Booked
                            </span>
                          )}
                        </span>
                      </div>

                      {!space.is_available && space.booked_by && (
                        <div className="info-item">
                          <span className="info-label">Booked By</span>
                          <span className="info-value">ID: {space.booked_by}</span>
                        </div>
                      )}

                      {!space.is_available && space.booking_time && (
                        <div className="info-item">
                          <span className="info-label">Time Left</span>
                          <span className="info-value">{timeLeft}</span>
                        </div>
                      )}
                    </div>

                    {!space.is_available && space.booking_time && (
                      <p className="car-description">
                        <strong>Booking Time:</strong> {displayBookingTime}
                      </p>
                    )}

                    <div className="car-actions">
                      <Link
                        to={`/spaces/${space.id}/edit`}
                        className="btn btn-primary"
                      >
                        Edit Space
                      </Link>
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
