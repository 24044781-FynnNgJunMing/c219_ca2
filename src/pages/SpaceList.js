import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces } from "../services/api";

export default function SpaceList() {
  const [spaces, setSpaces] = useState("");

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

  return (
    <>
      <div className="page-header">
        <h2>Study Spaces</h2>
        <p>Browse and book available study areas across campus</p>
      </div>

      <div className="car-list-page">
        <div className="container">
          <div className="car-grid">
            {spaces.map((space) => (
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
                      <span className="info-value">{space.capacity} {space.capacity === 1 ? 'Person' : 'People'}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className="info-value">
                        {space.is_available ? (
                          <span style={{ color: 'var(--status-available)' }}>Available</span>
                        ) : (
                          <span style={{ color: 'var(--status-booked)' }}>Booked</span>
                        )}
                      </span>
                    </div>

                    {!space.is_available && space.booked_by && (
                      <div className="info-item">
                        <span className="info-label">Booked By</span>
                        <span className="info-value">ID: {space.booked_by}</span>
                      </div>
                    )}
                  </div>

                  {!space.is_available && space.booking_time && (
                    <p className="car-description">
                      <strong>Booking Time:</strong>{' '}
                      {new Date(space.booking_time).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  )}

                  <div className="car-actions">
                    <Link to={`/spaces/${space.id}/edit`} className="btn btn-primary">
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