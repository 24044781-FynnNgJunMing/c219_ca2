import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpaceList from "./pages/SpaceList";
import AddSpace from "./pages/AddSpace";
import EditSpace from "./pages/EditSpace";
import BookSpace from "./pages/BookSpace";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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

        {/* Public: anyone can view spaces */}
        <Route path="/spaces" element={<SpaceList />} />

        {/* Must be logged in (student OR admin) */}
        <Route
          path="/spaces/:id/book"
          element={
            <ProtectedRoute roles={["student", "admin"]}>
              <BookSpace />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/spaces/new"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AddSpace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spaces/:id/edit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditSpace />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
