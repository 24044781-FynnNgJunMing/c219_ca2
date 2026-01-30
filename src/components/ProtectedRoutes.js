import NotFound from "../pages/NotFound";

export default function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) return <NotFound />;

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(userRole)) {
    return <NotFound />;
  }

  return children;
}
