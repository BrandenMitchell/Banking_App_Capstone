// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/Dashboard"; 
import Profile from "./components/profile";

const App = () => {
  return (
      <div className="App d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="bg-primary text-white text-center py-3">
          <h1>Banking App</h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element= {<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-2 mt-auto">
          <p>&copy; {new Date().getFullYear()} Banking App. All rights reserved.</p>
        </footer>
      </div>
  );
};

export default App;
