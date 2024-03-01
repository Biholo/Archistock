import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element
          />

          <Route
            path="/register"
            element
          />
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App
