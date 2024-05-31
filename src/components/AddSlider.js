import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalApi from '../utils/GlobalApi';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

export default function AddSlider() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const imageUrl = await uploadImage(image);
      const data = { name, image: imageUrl };
      await GlobalApi.addSlider(data).then((resp) => {
        alert('Slider added successfully');
        navigate('/admin-dashboard');
      });
    } catch (error) {
      console.error('Error adding slider:', error);
      setError('Failed to add slider');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Add New Slider
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {imagePreview && (
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={imagePreview}
                alt="Slider Preview"
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          )}
          <TextField
            label="Slider Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Button
            variant="contained"
            component="label"
          >
            Upload Slider Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <Button type="submit" variant="contained" color="secondary">
            Add Slider
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
