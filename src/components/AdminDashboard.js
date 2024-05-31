import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import GlobalApi from '../utils/GlobalApi';
import { Box, Button,useTheme} from "@mui/material";
import Header from './Header';
import { tokens } from "../theme";
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import StatBox from './StatBox';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [businessLists, setBusinessLists] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalUsers, setTotalUsers] = useState(0);

  const API_KEY = 'https://prj-backend.onrender.com/users';
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get('https://prj-backend.onrender.com/users', {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        setTotalUsers(response.data.length); // Adjust this based on your actual API response structure
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    fetchTotalUsers();
  }, []);
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://prj-backend.onrender.com/admin-dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error('Dashboard Error:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setMessage('You are not authorized to view this page');
        }
      }
    };

    const fetchCategories = async () => {
      try {
        const fetchedCategories = await GlobalApi.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const fetchedBookings = await GlobalApi.getBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    const fetchBusinessLists = async () => {
      try {
        const fetchedBusinessLists = await GlobalApi.getBusinessLists();
        setBusinessLists(fetchedBusinessLists);
      } catch (error) {
        console.error('Error fetching business lists:', error);
      }
    };

    fetchDashboard();
    fetchCategories();
    fetchBookings();
    fetchBusinessLists();
  }, [navigate]);
  const data = [
    { day: "Monday", bookings: 5 },
    { day: "Tuesday", bookings: 6 },
    { day: "Wednesday", bookings: 8 },
    { day: "Thursday", bookings: 1 },
    { day: "Friday", bookings: 5 },
    { day: "Saturday", bookings: 5 },
    { day: "Sunday", bookings: 4 },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle={message} />
      </Box>
       {/* GRID & CHARTS */}
       <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            subtitle="Total Users"
            title={totalUsers.toLocaleString()}
            progress="1"
            increase="+14%"
            icon={
              <PeopleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Service Providers"
            progress="0.50"
            increase="+21%"
            icon={
              <EngineeringIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Bookings"
            progress="1"
            increase="+43%"
            icon={
              <PlaylistAddCheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="none"
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="#ffffff"
        >
          <ResponsiveContainer width="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#9F32E2" />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%">
          <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>

      <h3>Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>{booking.userName} - {booking.bookingStatus}</li>
        ))}
      </ul>

      <h3>Business Lists</h3>
      <ul>
        {businessLists.map((business) => (
          <li key={business.id}>{business.name}</li>
        ))}
      </ul>
          </ResponsiveContainer>
          </Box>
        
      </Box>
      {/* <div>
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>

      <h3>Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>{booking.userName} - {booking.bookingStatus}</li>
        ))}
      </ul>

      <h3>Business Lists</h3>
      <ul>
        {businessLists.map((business) => (
          <li key={business.id}>{business.name}</li>
        ))}
      </ul>
    </div> */}
    </Box>
  );
};

export default AdminDashboard;
