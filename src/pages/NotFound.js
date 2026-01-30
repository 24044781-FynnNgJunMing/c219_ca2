import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="form-page">
      <div className="container" style={{ textAlign: "center" }}>
        <h1>404</h1>
        <p>Page not found or you don’t have access to this page.</p>

        <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
