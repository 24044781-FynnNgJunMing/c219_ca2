import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";
import { getSpaces, updateSpace, deleteSpace } from "../services/api";

export default function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSpace() {
      try {
        setLoading(true);
        setError(null);

        const spaces = await getSpaces();

        const found = spaces.find((s) => s.space_id === parseInt(id, 10));

        if (!found) setError("Study space not found");
        else setSpace(found);
      } catch (err) {
        setError(err.message || "Failed to load study space");
      } finally {
        setLoading(false);
      }
    }

    fetchSpace();
  }, [id]);

  async function handleSubmit(spaceData) {
    try {
      setBusy(true);
      setError(null);
      
      const payload = {
        space_name: spaceData.space_name,
        location: spaceData.location,
        capacity: Number(spaceData.capacity),
        zone_type: spaceData.zone_type,
        is_available: Boolean(spaceData.is_available),
        booked_by: spaceData.booked_by === "" || spaceData.booked_by == null
          ? null
          : Number(spaceData.booked_by),
        booking_time: spaceData.booking_time === "" ? null : spaceData.booking_time,
      };

      await updateSpace(id, payload);
      navigate("/spaces");
    } catch (err) {
      setError(err.message || "Failed to update study space");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!space) return;

    const ok = window.confirm(
      `Delete "${space.space_name}"? This cannot be undone.`
    );
    if (!ok) return;

    try {
      setBusy(true);
      setError(null);
      await deleteSpace(id);
      navigate("/spaces");
    } catch (err) {
      setError(err.message || "Failed to delete study space");
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

  if (error && !space) {
    return (
      <>
        <div className="page-header">
          <div className="container">
            <h2>Edit Study Space</h2>
          </div>
        </div>

        <div className="form-page">
          <div className="container">
            <div className="error-message">{error}</div>

            <button onClick={() => navigate("/spaces")} className="btn btn-primary">
              Back to Spaces
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h2>Edit Study Space</h2>
          <p>Update study space details</p>
        </div>
      </div>

      <div className="form-page">
        <div className="container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {space && (
            <>
              <SpaceForm
                space={space}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                busy={busy}
              />

              <div className="delete-section">
                <h3>Delete Study Space</h3>
                <p>
                  Once you delete this study space, it cannot be recovered.
                  Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="btn btn-danger"
                >
                  Delete Space
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
