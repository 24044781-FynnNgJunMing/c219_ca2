import { useEffect, useState } from "react";
import { getCars } from "../services/api";

export default function CarList() {
  const [cars, setCars] = useState("");

  useEffect(() => {
    getCars()
      .then((data) => {
        setCars(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (cars === "") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Car List</h2>

      {cars.map((car) => (
        <div key={car.id}>
          <p>Name: {car.car_name}</p>
          <p>Brand: {car.brand}</p>
          <p>Year: {car.year}</p>
          <p>Price: {car.price}</p>
          <p>Stock: {car.stocks}</p>

          {/* ✅ Car Image */}
          {car.car_image && (
            <img
              src={car.car_image}
              alt={car.car_name}
              width="200"
            />
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
