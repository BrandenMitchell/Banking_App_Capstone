// App.js
import React, { StrictMode } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './pages/LoginPage'
import Register from './components/register';
import { Routes, Route, Router } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return(
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>);

  // return (
  //   <div className="App d-flex flex-column min-vh-100">
      
  //     {/* Header */}
  //     <header className="bg-primary text-white text-center py-3">
  //       <h1>Banking App</h1>
  //     </header>

  //     {/* Main Content */}
  //     <main className="flex-grow-1 d-flex justify-content-center align-items-center">
  //       {/* Render Login Component */}
  //       {/* <Login /> */}
  //       {/* <Register /> */}
  //     </main>

  //     {/* Footer */}
  //     <footer className="bg-dark text-white text-center py-2 mt-auto">
  //       <p>&copy; {new Date().getFullYear()} Banking App. All rights reserved.</p>
  //     </footer>
  //   </div>
  // );
};

export default App;
