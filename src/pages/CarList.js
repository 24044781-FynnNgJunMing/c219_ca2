import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCars } from "../services/api";

export default function CarList() {
  const [cars, setCars] = useState("");
  const [imageErrors, setImageErrors] = useState({}); // track broken images by car.id

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [priceSort, setPriceSort] = useState(""); // "", "low-high", "high-low"

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

  // Base style for all filter controls
  const filterBaseStyle = {
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    color: "#374151", // consistent font colour
    backgroundColor: "white",
    transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
    boxShadow: "none",
    transform: "translateY(0)",
  };

  // Apply filters: car name / brand + year
  const filteredCars = cars.filter((car) => {
    const matchSearch =
      searchTerm === "" ||
      car.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase());

    const matchYear =
      yearFilter === "" || String(car.year) === yearFilter;

    return matchSearch && matchYear;
  });

  // Sort by price based on dropdown
  const sortedCars = [...filteredCars];

  if (priceSort === "low-high") {
    sortedCars.sort((a, b) => Number(a.price) - Number(b.price));
  }

  if (priceSort === "high-low") {
    sortedCars.sort((a, b) => Number(b.price) - Number(a.price));
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
          {/* Breadcrumb: Home > Listing */}
          <div
            style={{
              marginBottom: 16,
              fontSize: "14px",
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Link
              to="/"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Home
            </Link>
            <span style={{ color: "#d1d5db" }}>›</span>
            <span style={{ color: "#6b7280", fontWeight: 500 }}>Listing</span>
          </div>

          {/* Filter section */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                padding: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Search by make / model */}
              <input
                type="text"
                placeholder="Search by car make or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  ...filterBaseStyle,
                  minWidth: 250,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(59,130,246,0.35)";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              />

              {/* Year filter */}
              <input
                type="text"
                placeholder="Filter by year"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                style={{
                  ...filterBaseStyle,
                  minWidth: 140,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 0 2px rgba(59,130,246,0.35)";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#d1d5db";
                }}
              />

              {/* Price sort dropdown with custom arrow */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  minWidth: 170,
                }}
              >
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  style={{
                    ...filterBaseStyle,
                    width: "100%",
                    paddingRight: 32,
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59,130,246,0.35)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  <option value="">Price (default)</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>

                {/* ▼ Icon */}
                <span
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  ▼
                </span>
              </div>

              {/* Clear filters button */}
              {(searchTerm || yearFilter || priceSort) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setYearFilter("");
                    setPriceSort("");
                  }}
                  style={{
                    ...filterBaseStyle,
                    backgroundColor: "white",
                    color: "#6b7280",
                    border: "1px solid #d1d5db",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.12)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 2px rgba(59,130,246,0.35)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {sortedCars.length === 0 ? (
            <div className="empty-state">
              <h3>No Cars Available</h3>
              <p>Try changing the filters or start by adding your first car</p>
              <Link to="/cars/new" className="btn btn-primary btn-large">
                Add Your First Car
              </Link>
            </div>
          ) : (
            <div className="car-grid">
              {sortedCars.map((car) => {
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
                        <div
                          className="car-image-placeholder"
                          aria-label="No image available"
                        ></div>
                      )}
                    </div>

                    <div className="car-details">
                      <h3 className="car-name">{car.car_name}</h3>
                      <span className="car-brand">{car.brand}</span>

                      {car.car_description && (
                        <p className="car-description">
                          {car.car_description}
                        </p>
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

                      <div className="car-price">
                        ${Number(car.price).toLocaleString()}
                      </div>

                      <div className="car-actions">
                        <Link
                          to={`/cars/${car.id}/edit`}
                          className="btn btn-primary"
                        >
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
