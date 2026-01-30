import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CarList from "./pages/CarList";
import AddCar from "./pages/AddCar";
import EditCar from "./pages/EditCar";
import "./Styles.css";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/new" element={<AddCar />} />
        <Route path="/cars/:id/edit" element={<EditCar />}/>
      </Routes>
    </BrowserRouter>
  );
}
