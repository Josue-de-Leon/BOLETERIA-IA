import React from 'react';
// import Home from './view/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './view/Login';
import Index from './view/Index';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/chatbot" element={<Index />} />
        {/* Agrega aquí las rutas adicionales que necesites */}
      </Routes>
      
      {/* <Home /> */}
      
    </div>
  );
}

export default App;
