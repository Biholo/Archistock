import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ComponentsTest from './pages/ComponentsTest/ComponentsTest';
import Aside from './components/Aside/Aside';

import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>   
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/*" element={<UserLogged />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const UserLogged = () => {
  return (
    <div className="flex min-h-dvh text-black">
      <div className="w-2/12 bg-white">
        <Aside></Aside>
      </div>
      <div className="w-10/12 mx-4 my-4 bg-white-100 shadow-md">
        <div className='m-4'></div>
        <Routes>
          <Route path="/components" element={<ComponentsTest />} />
          <Route path="storage" element={<div>Storage</div>} />
          <Route path="extend" element={<div>Extend</div>} />
          <Route path="upload" element={<div>Upload</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
