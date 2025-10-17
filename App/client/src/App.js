// App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";
import RegisterForm  from './components/RegisterForm';
import Homepage from './components/Homepage';
import Budget from './components/Budget';
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="text-white text-center py-3">
        <h1>Neptune Bank</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy; {new Date().getFullYear()} Neptune Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
