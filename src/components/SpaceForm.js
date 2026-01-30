import { useEffect, useState } from "react";

export default function SpaceForm({ space, onSubmit, onCancel, busy }) {
  const [formData, setFormData] = useState({
    space_name: space?.space_name || "",
    location: space?.location || "",
    capacity: space?.capacity ?? "",
    zone_type: space?.zone_type || "Quiet",
    is_available: space?.is_available ?? true,
    booked_by: space?.booked_by ?? "",
    booking_time: space?.booking_time ?? "",
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
    });
  }, [space]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    // Checkbox uses checked instead of value
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // If available is true, booking fields should be cleared
      if (name === "is_available" && checked === true) {
        updated.booked_by = "";
        updated.booking_time = "";
      }

      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.space_name.trim()) return alert("Please enter a space name");
    if (!formData.location.trim()) return alert("Please enter a location");
    if (formData.capacity === "" || Number(formData.capacity) < 1)
      return alert("Capacity must be at least 1");
    if (!formData.is_available) {
      if (formData.booked_by === "" || Number(formData.booked_by) < 1) {
        return alert("Please enter booked_by (student ID) if the space is not available");
      }
      if (!formData.booking_time) {
        return alert("Please select a booking time if the space is not available");
      }
    }
    
    onSubmit({
      space_name: formData.space_name.trim(),
      location: formData.location.trim(),
      capacity: Number(formData.capacity),
      zone_type: formData.zone_type,
      is_available: Boolean(formData.is_available),
      booked_by:
        formData.booked_by === "" ? null : Number(formData.booked_by),
      booking_time: formData.booking_time === "" ? null : formData.booking_time,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="car-form">
      <div className="form-group">
        <label htmlFor="space_name">Space Name *</label>
        <input
          type="text"
          id="space_name"
          name="space_name"
          value={formData.space_name}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., Library Level 3 Study Area"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={busy}
          placeholder="e.g., Building A, Level 3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacity *</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          disabled={busy}
          min="1"
          placeholder="e.g., 4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="zone_type">Zone Type *</label>
        <select
          id="zone_type"
          name="zone_type"
          value={formData.zone_type}
          onChange={handleChange}
          disabled={busy}
          style={{
            width: "100%",
            padding: "0.875rem 1rem",
            border: "2px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-family)",
            fontSize: "1rem",
            background: "var(--white)",
          }}
        >
          <option value="Quiet">Quiet</option>
          <option value="Discussion">Discussion</option>
        </select>
      </div>

      <div className="form-group">
        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input
            type="checkbox"
            name="is_available"
            checked={Boolean(formData.is_available)}
            onChange={handleChange}
            disabled={busy}
          />
          Available
        </label>
        <p style={{ marginTop: "0.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          If available is checked, booking fields will be cleared automatically.
        </p>
      </div>

      {/* Booking fields only when NOT available */}
      {!formData.is_available && (
        <>
          <div className="form-group">
            <label htmlFor="booked_by">Booked By (Student ID) *</label>
            <input
              type="number"
              id="booked_by"
              name="booked_by"
              value={formData.booked_by}
              onChange={handleChange}
              disabled={busy}
              min="1"
              placeholder="e.g., 24001234"
            />
          </div>

          <div className="form-group">
            <label htmlFor="booking_time">Booking Time *</label>
            <input
              type="datetime-local"
              id="booking_time"
              name="booking_time"
              value={formData.booking_time}
              onChange={handleChange}
              disabled={busy}
            />
          </div>
        </>
      )}

      <div className="form-actions">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? "Saving..." : space ? "Update Space" : "Add Space"}
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
