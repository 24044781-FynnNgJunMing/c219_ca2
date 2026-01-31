import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";
import { addSpace } from "../services/api";

function toMySQLDateTime(value) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())}:00`;
}

export default function AddSpace() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem("userRole");

  if (userRole === "student") {
    return (
      <>
        <div className="page-header">
          <h2>Access Denied</h2>
          <p>You are not authorised to add study spaces.</p>
        </div>

        <div className="form-page">
          <div className="container">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/spaces")}
            >
              Back to Study Spaces
            </button>
          </div>
        </div>
      </>
    );
  }

  async function handleSubmit(spaceData) {
    try {
      setBusy(true);
      setError(null);

      const payload = {
        space_name: spaceData.space_name,
        location: spaceData.location,
        capacity: Number(spaceData.capacity),
        zone_type: spaceData.zone_type,
        is_available:
          spaceData.is_available === true ||
          spaceData.is_available === "true" ||
          spaceData.is_available === 1 ||
          spaceData.is_available === "1" ||
          spaceData.is_available === "on"
            ? 1
            : 0,
        booked_by:
          spaceData.booked_by === "" || spaceData.booked_by == null
            ? null
            : Number(spaceData.booked_by),
        booking_time:
          spaceData.booking_time === "" || spaceData.booking_time == null
            ? null
            : toMySQLDateTime(spaceData.booking_time),
        space_image: spaceData.space_image ?? null,
      };

      await addSpace(payload);
      navigate("/spaces");
    } catch (err) {
      setError(err.message || "Failed to add space");
      setBusy(false);
    }
  }

  function handleCancel() {
    navigate("/spaces");
  }

  return (
    <>
      <div className="page-header">
        <h2>Add Study Space</h2>
        <p>Create a new study space listing</p>
      </div>

      <div className="form-page">
        <div className="container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <SpaceForm
            space={null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            busy={busy}
          />
        </div>
      </div>
    </>
  );
}