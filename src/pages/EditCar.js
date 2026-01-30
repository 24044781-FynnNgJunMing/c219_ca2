import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CarForm from "../components/CarForm";
import { getCars, updateCar, deleteCar } from "../services/api";

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCar();
  }, [id]);

  async function fetchCar() {
    try {
      setLoading(true);
      setError(null);

      const cars = await getCars();
      const foundCar = cars.find((c) => c.id === parseInt(id));

      if (!foundCar) setError("Car not found");
      else setCar(foundCar);
    } catch (err) {
      setError(err.message || "Failed to load car");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(carData) {
    try {
      setBusy(true);
      setError(null);
      await updateCar(id, carData);
      navigate("/cars");
    } catch (err) {
      setError(err.message || "Failed to update car");
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!car) return;

    const ok = window.confirm(`Delete "${car.car_name}"? This cannot be undone.`);
    if (!ok) return;

    try {
      setBusy(true);
      setError(null);
      await deleteCar(id);
      navigate("/cars");
    } catch (err) {
      setError(err.message || "Failed to delete car");
      setBusy(false);
    }
  }

  function handleCancel() {
    navigate("/cars");
  }

  if (loading) {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading car...</p>
      </div>
    );
  }

  if (error && !car) {
    return (
      <>
        <div className="page-header">
          <div className="container">
            <h2>Edit Car</h2>
          </div>
        </div>
        <div className="form-page">
          <div className="container">
            <div className="error-message">
              {error}
            </div>
            <button onClick={() => navigate("/cars")} className="btn btn-primary">
              Back to Car List
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
          <h2>Edit Car</h2>
          <p>Update car details</p>
        </div>
      </div>

      <div className="form-page">
        <div className="container">
          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {car && (
            <>
              <CarForm
                car={car}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                busy={busy}
              />

              <div className="delete-section">
                <h3>Delete Car</h3>
                <p>
                  Once you delete this car, there is no going back. 
                  Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="btn btn-danger"
                >
                  Delete Car
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}