import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";
import { getSpaces, updateSpace, deleteSpace } from "../services/api";

function toDateTimeLocal(value) {
  if (!value) return "";
  const d = new Date(value.includes("Z") ? value : value + "Z");
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toMySQLDateTime(value) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())}:00`;
}

export default function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole === "student") return;
    fetchSpace();
  }, [id, userRole]);

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

      setSpace({
        ...foundSpace,
        is_available:
          foundSpace.is_available === 1 ||
          foundSpace.is_available === true ||
          foundSpace.is_available === "1" ||
          foundSpace.is_available === "true",
        booking_time: toDateTimeLocal(foundSpace.booking_time),
      });
    } catch (err) {
      setError(err.message || "Failed to load study space");
      setSpace(null);
    } finally {
      setLoading(false);
    }
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

      await updateSpace(id, payload);
      navigate("/spaces");
    } catch (err) {
      setError(err.message || "Failed to update study space");
    } finally {
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
    } finally {
      setBusy(false);
    }
  }

  function handleCancel() {
    navigate("/spaces");
  }

  if (userRole === "student") {
    return (
      <>
        <div className="page-header">
          <h2>Access Denied</h2>
          <p>You are not authorised to edit study spaces.</p>
        </div>

        <div className="form-page">
          <div className="container">
            <button
              onClick={() => navigate("/spaces")}
              className="btn btn-primary"
            >
              Back to Study Spaces
            </button>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="page-header">
          <h2>Edit Study Space</h2>
          <p>Loading study space...</p>
        </div>

        <div className="form-page">
          <div className="container">
            <p>Loading study space...</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !space) {
    return (
      <>
        <div className="page-header">
          <h2>Edit Study Space</h2>
          <p>Unable to load this study space.</p>
        </div>

        <div className="form-page">
          <div className="container">
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => navigate("/spaces")}
              className="btn btn-primary"
            >
              Back to Space List
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Edit Study Space</h2>
        <p>Update the details of this study space</p>
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
                <h3>Delete Space</h3>
                <p>
                  Once you delete this space, there is no going back. Please be
                  certain.
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