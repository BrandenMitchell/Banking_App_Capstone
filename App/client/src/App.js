// App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./components/login";

const App = () => {
  return (
    <div className="App d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-primary text-white text-center py-3">
        <h1>Banking App</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        {/* Render Login Component */}
        <Login />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-2 mt-auto">
        <p>&copy; {new Date().getFullYear()} Banking App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
