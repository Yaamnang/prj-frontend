import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalApi from '../utils/GlobalApi';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateBooking() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [businessListId, setBusinessListId] = useState('');
  const [businessLists, setBusinessLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinessLists = async () => {
      try {
        const fetchedBusinessLists = await GlobalApi.getBusinessLists();
        setBusinessLists(fetchedBusinessLists);
      } catch (error) {
        console.error('Error fetching business lists:', error);
      }
    };

    fetchBusinessLists();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userName || !userEmail || !date || !time || !businessListId) {
      toast.error('Please fill out all fields');
      return;
    }

    const data = {
      userName,
      userEmail,
      date,
      time,
      businessListId,
    };

    try {
      await GlobalApi.addBooking(data);
      toast.success('Booking created successfully');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer  position='top-center' />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Create New Booking
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="User Name"
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            required
            error={!userName}
            helperText={!userName && 'User Name is required'}
          />
          <TextField
            label="User Email"
            variant="outlined"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            fullWidth
            required
            error={!userEmail}
            helperText={!userEmail && 'User Email is required'}
          />
          <TextField
            label="Date"
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            required
            error={!date}
            helperText={!date && 'Date is required'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Time"
            variant="outlined"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            required
            error={!time}
            helperText={!time && 'Time is required'}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth required error={!businessListId}>
            <InputLabel id="businessList-label">Business List</InputLabel>
            <Select
              labelId="businessList-label"
              id="businessList"
              value={businessListId}
              onChange={(e) => setBusinessListId(e.target.value)}
              label="Business List"
            >
              <MenuItem value="">
                <em>Select a business list</em>
              </MenuItem>
              {businessLists.map((business) => (
                <MenuItem key={business.id} value={business.id}>
                  {business.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            Create Booking
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
