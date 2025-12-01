// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard"; 
import Profile from "./components/profile";
import LandingPage from "./components/LandingPage";
import AccountsPage from "./components/AccountsPage";
import ChatPage from "./components/ChatPage";
import Forgot from "./components/forgot";

const App = () => {
  return (
      <div className="App d-flex flex-column min-vh-100">
        {/* Header */}
        <header className="  text-center py-3">
          <h1>Neptune Banking </h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element= {<Dashboard />} />
            <Route path="/accounts" element= {<AccountsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/forgot" element={<Forgot />} />
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

