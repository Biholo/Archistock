import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ComponentsTest from './pages/ComponentsTest/ComponentsTest';
import Aside from './components/Aside/Aside';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import './App.css';
import Profil from './pages/Profil/Profil';
import NewPassword from './pages/NewPassword/NewPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ExtendStorage from './pages/ExtendStorage/ExtendStorage';
import { ToastContainer } from 'react-toastify';
import Statistics from './pages/Statistics/Statistics';
import Usersubscriptions from './pages/UserSubscriptions/Usersubscriptions';
import UploadFiles from './pages/UploadFiles/UploadFiles';
import EGModal from './components/Modals/EG';
import { StorageProvider } from './contexts/StorageContext';
import Company from './pages/Company/Company';
import RegisterInvitation from './pages/RegisterInvitation/RegisterInvitation';

import Pricing from './pages/Pricing/Pricing';
import Homepage from './pages/Homepage/Homepage';
import ApiPage from './pages/ApiPage/ApiPage';
import Solutions from './pages/Solutions/Solutions';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthRoutes />
      </AuthProvider>
    </Router>
  );
};

const AuthRoutes = () => {
  const { loggedIn, loading } = useAuth();

  if (loading) {

    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={loggedIn ? <UserLogged /> : <PublicRoutes />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register-invitation/:uuid" element={<RegisterInvitation />} />
      <Route path="/*" element={loggedIn ? <UserLogged /> : <Navigate to="/" />} />
      <Route path="/temp/reset-password/:jwt" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};

const PublicRoutes = () => {
  return (
    <div className='flex flex-col'>
      <Navbar />
      <Routes>
        <Route path="/api" element={<ApiPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/" element={<Pricing />} />
      </Routes>
      <Footer />
    </div>
  );
}

const UserLogged = () => {

  const [show, setShow] = React.useState(false);

  // add even listener to listen to konami code
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          alert('Konami code activated');
          setShow(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <div className="flex min-h-dvh text-black">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <EGModal show={show} handleClose={() => setShow(false)} />
      <div className="w-2/12 bg-white">
        <Aside />
      </div>
      <div className="w-10/12 mx-4 my-4 bg-white-100 shadow-md">
        <div className='m-4'></div>
        <Routes>
          <Route path="/statistics" element={<Statistics />} />

          <Route path="/components" element={<ComponentsTest />} />
          <Route path="/storage" element={
            <StorageProvider>
              <Usersubscriptions />
            </StorageProvider>
          } />
          <Route path="/extend" element={<ExtendStorage />} />
          <Route path="/*" element={<Company />} />
          <Route path="/upload" element={<UploadFiles />} />
          <Route path="/settings" element={<div>Settings</div>} />
          <Route path="/profile" element={<Profil />} />
          <Route path="/profile/change-password" element={<NewPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
