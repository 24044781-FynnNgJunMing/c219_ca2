import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";
import { getSpaces, updateSpace, deleteSpace } from "../services/api";

function toDateTimeLocal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toMySQLDateTime(value) {
  if (!value) return null;

  if (value.includes("T")) {
    const [date, time] = value.split("T");
    const hhmm = (time || "").slice(0, 5);
    if (!date || hhmm.length !== 5) return null;
    return `${date} ${hhmm}:00`;
  }

  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:00`;
  }

  return null;
}

export default function EditSpace() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <main className="editspace-loading">
        <h1>Edit Study Space</h1>
        <p>Loading study space...</p>
      </main>
    );
  }

  if (error && !space) {
    return (
      <main className="editspace-notfound">
        <h1>Edit Study Space</h1>
        <p className="spacelist-error-text">Error: {error}</p>
        <button
          onClick={() => navigate("/spaces")}
          className="editspace-back-button"
        >
          Back to Space List
        </button>
      </main>
    );
  }

  return (
    <main className="editspace-main">
      <h1 className="editspace-title">Edit Study Space</h1>

      {error && (
        <div className="editspace-error">
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

          <div className="editspace-delete">
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="editspace-delete-button"
            >
              Delete Space
            </button>
          </div>
        </>
      )}
    </main>
  );
}
