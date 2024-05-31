import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalApi from '../utils/GlobalApi';
import { Box, Button, TextField, Typography, Container, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';

export default function CreateBusinessList() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await GlobalApi.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'vlyunob6'); // Your Cloudinary unsigned upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/dtmdxthnp/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary URL for the uploaded image
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name.trim() || !about.trim() || !contactPerson.trim() || !address.trim() || !email.trim() || !categoryId || !image) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const imageUrl = await uploadImage(image);
      const data = {
        name,
        about,
        contactPerson,
        address,
        email,
        categoryId,
        imageUrl,
      };
      await GlobalApi.addBusinessList(data).then((resp) => {
        console.log("Resp", resp);
        alert('Business List added successfully');
        navigate('/admin-dashboard');
      });
    } catch (error) {
      console.error('Error adding business list:', error);
      setError('Failed to add business list');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Add New Business List
        </Typography>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {imagePreview && (
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={imagePreview}
                alt="Business Image Preview"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          <TextField
            label="Business Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={!name.trim()}
            helperText={!name.trim() ? 'Business Name is required' : ''}
          />
          <TextField
            label="About"
            variant="outlined"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            fullWidth
            required
            error={!about.trim()}
            helperText={!about.trim() ? 'About is required' : ''}
          />
          <TextField
            label="Contact Person"
            variant="outlined"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            fullWidth
            required
            error={!contactPerson.trim()}
            helperText={!contactPerson.trim() ? 'Contact Person is required' : ''}
          />
          <TextField
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            required
            error={!address.trim()}
            helperText={!address.trim() ? 'Address is required' : ''}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            error={!email.trim()}
            helperText={!email.trim() ? 'Email is required' : ''}
          />
          <FormControl fullWidth required error={!categoryId}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            component="label"
            color='secondary'
          >
            Upload Business Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          
          <Button type="submit" variant="contained" color="secondary">
            Add Business List
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
