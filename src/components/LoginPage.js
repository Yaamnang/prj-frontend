import React, { useState } from 'react';
import axios from 'axios';
import {Box,Button,TextField} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from "./logo.svg"
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!name.trim() || !password.trim()) {
        toast.error("Please enter both username and password");
        return;
      }

      const response = await axios.post('http://prj-backend.onrender.com/login', { name, password });
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#180C1A",
        padding: "20px",
        marginTop: "10%",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        style={{ width: "150px", height: "150px", marginBottom: "20px" }}
      />
      <form onSubmit={(e) => e.preventDefault()} style={{ width: "300px" }}>
        <TextField
          label="name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            style: { color: "#fff" },
          }}
          InputLabelProps={{
            style: { color: "#fff" },
          }}
        />
        {error && <p>{error}</p>}
        <Button
          type="submit"
          onClick={handleLogin}
          variant="contained"
          color="primary"
          style={{
            width: "100%",
            marginTop: "20px",
            backgroundColor: "#fff",
            color: "#2148C0",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};
export default LoginPage;
