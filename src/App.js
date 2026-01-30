import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SpaceList from "./pages/SpaceList";
import AddSpace from "./pages/AddSpace";
import EditSpace from "./pages/EditSpace";
import BookSpace from "./pages/BookSpace";
import Login from "./pages/Login"
import "./Styles.css";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spaces" element={<SpaceList />} />
        <Route path="/spaces/new" element={<AddSpace />} />
        <Route path="/spaces/:id/edit" element={<EditSpace />}/>
        <Route path="/spaces/:id/book" element={<BookSpace />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
