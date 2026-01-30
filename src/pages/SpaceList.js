import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSpaces } from "../services/api";

export default function SpaceList() {
  const [spaces, setSpaces] = useState("");

  useEffect(() => {
    getSpaces()
      .then((data) => {
        setSpaces(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (spaces === "") {
    return <p>Loading study spaces...</p>;
  }

  if (spaces.length === 0) {
    return (
      <div>
        <h2>Study Spaces</h2>
        <p>No spaces available</p>
        <Link to="/spaces/new">Add Study Space</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Study Spaces</h2>

      {spaces.map((space) => (
        <div key={space.space_id}>
          <h3>{space.space_name}</h3>

          <p>Location: {space.location}</p>
          <p>Capacity: {space.capacity}</p>
          <p>Zone Type: {space.zone_type}</p>
          <p>
            Status: {space.is_available ? "Available" : "Booked"}
          </p>

          {space.booked_by && (
            <p>Booked By: {space.booked_by}</p>
          )}

          {space.booking_time && (
            <p>Booking Time: {space.booking_time}</p>
          )}

          <Link to={`/spaces/${space.space_id}/edit`}>
            Edit
          </Link>

          <hr />
        </div>
      ))}
    </div>
  );
}
