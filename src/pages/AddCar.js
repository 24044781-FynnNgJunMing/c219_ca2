import { useState } from "react";
import { addCar } from "../services/api";

export default function AddCar() {
  const [carName, setCarName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [stocks, setStocks] = useState("");       // ✅ changed
  const [carImage, setCarImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const newCar = {
      car_name: carName,
      car_description: description,
      brand: brand,
      price: price,
      year: year,
      stocks: stocks,                             // ✅ changed
      car_image: carImage,
    };

    addCar(newCar)
      .then((res) => res.json())
      .then(() => {
        alert("Car added successfully");
        setCarName("");
        setDescription("");
        setBrand("");
        setPrice("");
        setYear("");
        setStocks("");                            // ✅ clear
        setCarImage("");
      })
      .catch(() => {
        alert("Failed to add car");
      });
  }

  return (
    <div>
      <h2>Add Car</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Car Name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
        />
        <br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />

        <input
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <br />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <br />

        <input
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <br />

        <input
          placeholder="Stock"
          value={stocks}
          onChange={(e) => setStocks(e.target.value)}
        />
        <br />

        <input
          placeholder="Image URL"
          value={carImage}
          onChange={(e) => setCarImage(e.target.value)}
        />
        <br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}
