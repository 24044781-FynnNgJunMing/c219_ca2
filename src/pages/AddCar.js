import { useNavigate } from "react-router-dom";
import CarForm from "../components/CarForm";
import { addCar } from "../services/api";
import { useState } from "react";

export default function AddCar() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(carData) {
    try {
      setBusy(true);
      setError(null);

      await addCar(carData);
      navigate("/cars");
    } catch (err) {
      setError(err.message || "Failed to add car");
      setBusy(false);
    }
  }

  function handleCancel() {
    navigate("/cars");
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h2>Add New Car</h2>
          <p>Add a vehicle to your collection</p>
        </div>
      </div>

      <div className="form-page">
        <div className="container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <CarForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            busy={busy}
          />
        </div>
      </div>
    </>
  );
}