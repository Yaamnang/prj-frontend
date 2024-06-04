import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import Header from './Header';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://prj-backend.onrender.com/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched Users:', response.data); // Debugging statement
        setUsers(response.data);
      } catch (error) {
        console.error('Users Fetch Error:', error);
        setMessage('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [navigate]);

  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://prj-backend.onrender.com/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Deleted User ID:', userId); // Debugging statement
      setUsers(users.filter(user => user.id !== userId));
      setMessage('User deleted successfully');
    } catch (error) {
      console.error('Delete User Error:', error);
      setMessage('Failed to delete user');
    }
  };

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing Users" />
      {message && <p>{message}</p>}
      <TableContainer component={Paper}>
        <Table backgroundColor={colors.primary[400]}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Registrar ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  {user.email_addresses && user.email_addresses.length > 0 
                    ? user.email_addresses[0].email_address 
                    : 'N/A'}
                </TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
