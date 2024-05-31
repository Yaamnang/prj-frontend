import React, { useEffect, useState } from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Users from './components/Users';
import AddSlider from './components/AddSlider';
import AddCategory from './components/AddCategory';
import CreateBusinessList from './components/CreateBusinessList';
import UserBooking from './components/UserBooking';
import CreateBooking from './components/CreateBooking';
import CategoryList from './components/Category';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const AuthenticatedApp = ({ isSidebar, setIsSidebar }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-slider" element={<AddSlider />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/create-business-list" element={<CreateBusinessList />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/user-bookings" element={<UserBooking />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default AuthenticatedApp;
