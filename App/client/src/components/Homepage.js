import React from 'react';
import { Link } from 'react-router-dom';
import '../css/homepage.css';

export default function Homepage() {
  return (
    <div className="container my-5 homepage-container" style={{ maxWidth: 900 }}>
      <div className="text-center mb-4">
        <h2>Welcome to Banking App</h2>
        <p>What would you like to do today?</p>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Budget Planner</h5>
              <p className="card-text">Generate a monthly budget using your transactions</p>
              <Link to="/budget" className="btn btn-primary mt-auto">Open Budget Planner</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">View or update your account details</p>
              <button className="btn btn-outline-secondary mt-auto" disabled>Coming soon</button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/login" className="btn btn-link">Log out</Link>
      </div>
    </div>
  );
}
