import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSpaces, updateSpace } from "../services/api";

export default function BookSpace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSpace();
  }, [id]);

  async function fetchSpace() {
    try {
      setLoading(true);
      setError(null);

      const spaces = await getSpaces();
      const foundSpace = spaces.find((s) => s.id === parseInt(id, 10));

      if (!foundSpace) {
        setError("Study space not found");
        setSpace(null);
        return;
      }

      if (!foundSpace.is_available) {
        setError("This space is already booked");
      }

      setSpace(foundSpace);
    } catch (err) {
      setError(err.message || "Failed to load study space");
      setSpace(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userId) {
      setError("You must be logged in to book a space");
      return;
    }

    try {
      setBusy(true);
      setError(null);

      const now = new Date().toISOString();

      await updateSpace(id, {
        is_available: 0,
        booked_by: Number(userId),
        booking_time: now,
      });

      alert("Space booked successfully!");
      navigate("/spaces");
    } catch (err) {
      setError(err.message || "Failed to book space");
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    navigate("/spaces");
  }

  if (loading) {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading study space...</p>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="form-page">
        <div className="container">
          <div className="error-message">{error || "Space not found"}</div>
          <button onClick={handleCancel} className="btn btn-outline">
            Back to Spaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Book Study Space</h2>
        <p>Confirm your booking</p>
      </div>

      <div className="form-page">
        <div className="container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="car-form">
            <div className="form-group">
              <label>Space Name</label>
              <input type="text" value={space.space_name} disabled />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" value={space.location} disabled />
            </div>

            <div className="form-group">
              <label>Zone Type</label>
              <input type="text" value={space.zone_type} disabled />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="text"
                value={`${space.capacity} ${
                  space.capacity === 1 ? "Person" : "People"
                }`}
                disabled
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy || !space.is_available}
              >
                {busy ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
