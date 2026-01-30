import { useEffect, useState } from "react";

export default function SpaceForm({ space, onSubmit, onCancel, busy }) {
  const role = localStorage.getItem("userRole");
  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    space_name: space?.space_name || "",
    location: space?.location || "",
    capacity: space?.capacity ?? "",
    zone_type: space?.zone_type || "Quiet",
    is_available: space?.is_available ?? true,
    booked_by: space?.booked_by ?? "",
    booking_time: space?.booking_time ?? "",
    space_image: space?.space_image ?? "",
  });

  useEffect(() => {
    if (!space) return;

    setFormData({
      space_name: space.space_name ?? "",
      location: space.location ?? "",
      capacity: space.capacity ?? "",
      zone_type: space.zone_type ?? "Quiet",
      is_available: space.is_available ?? true,
      booked_by: space.booked_by ?? "",
      booking_time: space.booking_time ?? "",
      space_image: space.space_image ?? "",
    });
  }, [space]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      if (name === "is_available" && checked === true) {
        updated.booked_by = "";
        updated.booking_time = "";
      }

      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (isAdmin) {
      if (!formData.space_name.trim()) return alert("Please enter a space name");
      if (!formData.location.trim()) return alert("Please enter a location");
      if (formData.capacity === "" || Number(formData.capacity) < 1)
        return alert("Capacity must be at least 1");

      if (formData.space_image.trim() !== "") {
        const img = formData.space_image.trim();
        if (!img.startsWith("http://") && !img.startsWith("https://")) {
          return alert("Space Image must start with http:// or https://");
        }
      }
    }

    onSubmit({
      space_name: formData.space_name.trim(),
      location: formData.location.trim(),
      capacity: Number(formData.capacity),
      zone_type: formData.zone_type,
      is_available: Boolean(formData.is_available),
      booked_by:
        formData.booked_by === "" || !isAdmin
          ? null
          : Number(formData.booked_by),
      booking_time:
        formData.booking_time === "" || !isAdmin
          ? null
          : formData.booking_time,
      space_image:
        formData.space_image.trim() === "" || !isAdmin
          ? null
          : formData.space_image.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="car-form">
      {isAdmin && (
        <>
          <div className="form-group">
            <label>Space Name *</label>
            <input
              type="text"
              name="space_name"
              value={formData.space_name}
              onChange={handleChange}
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label>Capacity *</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label>Zone Type *</label>
            <select
              name="zone_type"
              value={formData.zone_type}
              onChange={handleChange}
              disabled={busy}
            >
              <option value="Quiet">Quiet</option>
              <option value="Discussion">Discussion</option>
            </select>
          </div>

          <div className="form-group">
            <label>Space Image (URL)</label>
            <input
              type="text"
              name="space_image"
              value={formData.space_image}
              onChange={handleChange}
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_available"
                checked={Boolean(formData.is_available)}
                onChange={handleChange}
                disabled={busy}
              />
              Available
            </label>
          </div>
        </>
      )}

      {!formData.is_available && (
        <>
          <div className="form-group">
            <label>Booked By (Student ID)</label>
            <input
              type="number"
              name="booked_by"
              value={formData.booked_by}
              onChange={handleChange}
              disabled={busy || !isAdmin}
            />
          </div>

          <div className="form-group">
            <label>Booking Time</label>
            <input
              type="datetime-local"
              name="booking_time"
              value={formData.booking_time}
              onChange={handleChange}
              disabled={busy || !isAdmin}
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="btn btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
