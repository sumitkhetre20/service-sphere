import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    bio: '',
    experience: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }

    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      },
      bio: user.profile?.bio || '',
      experience: user.profile?.experience || ''
    });

    setLoading(false);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!profile.name || !profile.phone) {
        setError('Name and phone are required');
        return;
      }

      const profileData = {
        name: profile.name?.trim(),
        phone: profile.phone?.trim(),
        address: profile.address || {},
        profile: {
          bio: profile.bio?.trim() || '',
          experience: profile.experience?.trim() || ''
        }
      };

      const response = await updateProfile(profileData);
      
      // Handle successful response
      if (response?.data?.success) {
        setSuccess(response.data.message || 'Profile updated successfully!');
        
        // Update local state with returned user data if available
        if (response.data.user) {
          // Update auth context if needed
          // This depends on your AuthContext implementation
        }
      } else {
        setError(response?.data?.message || 'Profile update failed');
      }
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      
      // Handle different error types
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0] || 
                          err.message || 
                          'Profile update failed';
      
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Provider Profile</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="experience"
                value={profile.experience}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={updating}
              className="w-100 mt-4"
            >
              {updating ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProviderProfile;
