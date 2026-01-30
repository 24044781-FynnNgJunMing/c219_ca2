import { useEffect, useState } from "react";

export default function SpaceForm({ space, onSubmit, onCancel, busy }) {
  const [formData, setFormData] = useState({
    car_name: car?.car_name || "",
    car_description: car?.car_description || "",
    brand: car?.brand || "",
    price: car?.price || "",
    year: car?.year || "",
    stocks: car?.stocks || "",
    car_image: car?.car_image || "",
  });

  useEffect(() => {
    if (!car) return;

    setFormData({
      car_name: car.car_name ?? "",
      car_description: car.car_description ?? "",
      brand: car.brand ?? "",
      price: car.price ?? "",
      year: car.year ?? "",
      stocks: car.stocks ?? "",
      car_image: car.car_image ?? "",
    });
  }, [car]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.car_name.trim()) return alert("Please enter a car name");
    if (!formData.brand.trim()) return alert("Please enter a brand");
    if (!formData.price.toString().trim()) return alert("Please enter a price");
    if (!formData.year.toString().trim()) return alert("Please enter a year");
    if (!formData.stocks.toString().trim()) return alert("Please enter stocks");

    onSubmit({
      ...formData,
      year: Number(formData.year),
      stocks: Number(formData.stocks),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <div className="form-group">
        <label htmlFor="car_name">Car Name *</label>
        <input
          type="text"
          id="car_name"
          name="car_name"
          value={formData.car_name}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., Toyota Camry"
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Brand *</label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., Toyota"
        />
      </div>

      <div className="form-group">
        <label htmlFor="car_description">Description</label>
        <textarea
          id="car_description"
          name="car_description"
          value={formData.car_description}
          onChange={handleChange}
          disabled={busy}
          placeholder="Enter a description of the car"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price *</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., 25000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="year">Year *</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., 2024"
          min="1900"
          max="2099"
        />
      </div>

      <div className="form-group">
        <label htmlFor="stocks">Stock *</label>
        <input
          type="number"
          id="stocks"
          name="stocks"
          value={formData.stocks}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., 5"
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="car_image">Image URL</label>
        <input
          type="url"
          id="car_image"
          name="car_image"
          value={formData.car_image}
          onChange={handleChange}
          disabled={busy}
          placeholder="https://example.com/car-image.jpg"
        />
      </div>

      {formData.car_image && (
        <div className="image-preview">
          <img
            src={formData.car_image}
            alt="Preview"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      <div className="form-actions">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Saving..." : car ? "Update Car" : "Add Car"}
        </button>

        <button type="button" onClick={onCancel} disabled={busy} className="btn btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}