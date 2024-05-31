import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalApi from '../utils/GlobalApi';
import { Box, Button, TextField, Typography, Container, Alert } from '@mui/material';

export default function AddCategory() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const uploadIcon = async (iconFile) => {
    const formData = new FormData();
    formData.append('file', iconFile);
    formData.append('upload_preset', 'vlyunob6'); // Your Cloudinary unsigned upload preset

    const response = await fetch('https://api.cloudinary.com/v1_1/dtmdxthnp/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Icon upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary URL for the uploaded icon
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    if (!icon) {
      setError('Please select an icon');
      return;
    }

    try {
      const iconUrl = await uploadIcon(icon);
      const data = { name, icon: iconUrl };
      await GlobalApi.addCategory(data).then((resp) => {
        alert('Category added successfully');
        navigate('/admin-dashboard');
      });
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Add New Category
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {iconPreview && (
            <Box mt={2} display="flex" justifyContent="center">
              <img
                src={iconPreview}
                alt="Category Icon Preview"
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
            label="Category Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Button
            variant="contained"
            component="label"
            color="secondary"
          >
            Upload Category Icon
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleIconChange}
            />
          </Button>
          
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          <Button type="submit" variant="contained" color="secondary">
            Add Category
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
