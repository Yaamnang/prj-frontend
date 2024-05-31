import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
// import AdminDashboard from './components/AdminDashboard';
// import Users from './components/Users';
// import AddSlider from './components/AddSlider';
// import AddCategory from './components/AddCategory';
// import CreateBusinessList from './components/CreateBusinessList';
// import UserBooking from './components/UserBooking';
// import CreateBooking from './components/CreateBooking';
// import CategoryList from './components/Category'; // Ensure this path matches your file structure
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Sidebar from './components/Sidebar';
// import Topbar from './components/Topbar';
import AuthenticatedApp from './AuthenticatedApp';

const App = () => {
  const [theme, colormode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colormode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ToastContainer position="top-center" />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={<AuthenticatedApp isSidebar={isSidebar} setIsSidebar={setIsSidebar} />}
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
