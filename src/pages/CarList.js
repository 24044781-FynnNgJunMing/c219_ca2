import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCars } from "../services/api";

export default function CarList() {
  const [cars, setCars] = useState("");
  const [imageErrors, setImageErrors] = useState({}); // track broken images by car.id

  useEffect(() => {
    getCars()
      .then((data) => {
        setCars(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function markImageError(carId) {
    setImageErrors((prev) => ({ ...prev, [carId]: true }));
  }

  if (cars === "") {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h2>Our Car Collection</h2>
          <p>Browse our available vehicles</p>
        </div>
      </div>

      <div className="car-list-page">
        <div className="container">
          {cars.length === 0 ? (
            <div className="empty-state">
              <h3>No Cars Available</h3>
              <p>Start by adding your first vehicle to the collection</p>
              <Link to="/cars/new" className="btn btn-primary btn-large">
                Add Your First Car
              </Link>
            </div>
          ) : (
            <div className="car-grid">
              {cars.map((car) => {
                const hasImage = Boolean(car.car_image);
                const isBroken = Boolean(imageErrors[car.id]);
                const showImage = hasImage && !isBroken;

                return (
                  <div key={car.id} className="car-card">
                    <div className="car-image-container">
                      {showImage ? (
                        <img
                          src={car.car_image}
                          alt={car.car_name}
                          onError={() => markImageError(car.id)}
                        />
                      ) : (
                        // No emoji: just a clean placeholder block
                        <div className="car-image-placeholder" aria-label="No image available"></div>
                      )}
                    </div>

                    <div className="car-details">
                      <h3 className="car-name">{car.car_name}</h3>
                      <span className="car-brand">{car.brand}</span>

                      {car.car_description && (
                        <p className="car-description">{car.car_description}</p>
                      )}

                      <div className="car-info">
                        <div className="info-item">
                          <span className="info-label">Year</span>
                          <span className="info-value">{car.year}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Stock</span>
                          <span className="info-value">{car.stocks}</span>
                        </div>
                      </div>

                      <div className="car-price">${car.price.toLocaleString()}</div>

                      <div className="car-actions">
                        <Link to={`/cars/${car.id}/edit`} className="btn btn-primary">
                          Edit
                        </Link>
                        <button className="btn btn-outline">Details</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
