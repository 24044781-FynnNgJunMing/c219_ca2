import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
import CarList from "./pages/CarList";
import AddCar from "./pages/AddCar";
// import EditCard from "./pages/EditCard";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/cars" element={<CarList />} />
        <Route path="/cars/new" element={<AddCar />} />
        {/* <Route path="/cards/:id/edit" element={<EditCard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
