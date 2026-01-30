import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Car</h1>
          <p className="hero-subtitle">Quality vehicles at competitive prices</p>
          <p className="hero-description">
            Browse our extensive collection of new and pre-owned vehicles.
            From sedans to SUVs, find the car that fits your lifestyle and budget.
          </p>
          <Link to="/cars" className="btn btn-primary btn-large">
            Browse Cars
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">Selection</div>
              <h3>Wide Selection</h3>
              <p>
                Explore a diverse range of vehicles from trusted brands
                and manufacturers.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Pricing</div>
              <h3>Best Prices</h3>
              <p>
                Competitive pricing with transparent deals and no hidden fees.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Quality</div>
              <h3>Quality Assured</h3>
              <p>
                Every vehicle is thoroughly inspected and certified for your peace of mind.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Support</div>
              <h3>Expert Service</h3>
              <p>
                Professional support and guidance throughout your buying journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Next Car?</h2>
          <p>Start browsing our inventory today</p>
          <Link to="/cars" className="btn btn-outline btn-large">
            View All Cars
          </Link>
        </div>
      </section>
    </div>
  );
}
