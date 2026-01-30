import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpaceList from "./pages/SpaceList";
import AddSpace from "./pages/AddSpace";
import EditSpace from "./pages/EditSpace";
import BookSpace from "./pages/BookSpace";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoutes";
import "./Styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/spaces"
          element={
            <ProtectedRoute>
              <SpaceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spaces/:id/book"
          element={
            <ProtectedRoute>
              <BookSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spaces/new"
          element={
            <ProtectedRoute role="admin">
              <AddSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spaces/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <EditSpace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
