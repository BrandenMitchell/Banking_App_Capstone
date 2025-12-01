import React from "react";
import "../css/landingPage.css";
import { Container, Navbar, Nav, Button } from "react-bootstrap";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar-custom">
        <Container className="justify-content-end">
          <Nav>
            <Nav.Link href="/login" className="register-btn">
              Sign Up / Login
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Neptune Banking</h1>
          <p className="hero-tagline">
            Efficient budget creation and expense tracking — all in one secure place.
          </p>
          <Button href="/login" className="hero-btn">
            Get Started
          </Button>
        </div>
      </div>

      {/* About Section */}
      <section className="about-section">
        <Container>
          <h2>About Neptune</h2>
          <p>
            Neptune Banking helps you simplify your financial life. Track your
            spending, manage multiple accounts, and reach your savings goals
            faster — all from one secure dashboard.
          </p>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
