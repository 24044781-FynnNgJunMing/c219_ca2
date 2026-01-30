import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceForm from "../components/SpaceForm";
import { addSpace } from "../services/api";

export default function AddSpace() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(spaceData) {
    try {
      setBusy(true);
      setError(null);

      await addSpace(spaceData);
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