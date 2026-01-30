import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Study Space</h1>
          <p className="hero-subtitle">Library & Study Area Booking System</p>
          <p className="hero-description">
            Stop wasting time searching for seats. Browse real-time availability 
            across campus libraries and study areas. Book quiet zones for focused work 
            or discussion spaces for group projects.
          </p>
          <Link to="/spaces" className="btn btn-primary btn-large">
            Browse Study Spaces
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Use StudySpace</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">Real-Time</div>
              <h3>Live Availability</h3>
              <p>
                See which study spaces are available right now. No more walking 
                around campus looking for an empty seat.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Book Ahead</div>
              <h3>Reserve Your Space</h3>
              <p>
                Secure your spot before you arrive. Perfect for group study 
                sessions or exam preparation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Filters</div>
              <h3>Find What You Need</h3>
              <p>
                Filter by group size, location, and zone type. Find quiet areas 
                for solo work or discussion zones for collaboration.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Smart Search</div>
              <h3>Avoid the Crowds</h3>
              <p>
                Know exactly which areas are busy or available. Make informed 
                decisions about where to study.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Study Space?</h2>
          <p>Browse available spaces and book your perfect spot today</p>
          <Link to="/spaces" className="btn btn-outline btn-large">
            View All Spaces
          </Link>
        </div>
      </section>
    </div>
  );
}