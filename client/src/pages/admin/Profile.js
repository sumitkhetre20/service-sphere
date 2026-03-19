import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Spinner, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [localLoading, setLocalLoading] = useState(true);
  const navigate = useNavigate();
  const { user, updateProfile, loading } = useAuth();

  useEffect(() => {
    console.log('🔍 Admin Profile useEffect triggered');
    console.log('User data:', user);
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    // Always set profile from user data (fresh from database)
    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    });
    
    setLocalLoading(false);
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
    try {
      await updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (localLoading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Profile</h1>
      
      <Card className="shadow-sm">
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
                    name="email"
                    value={profile.email}
                    disabled
                    readOnly
                  />
                  <Form.Text className="text-muted">Email cannot be changed</Form.Text>
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
            
            <h5 className="mt-4 mb-3">Address</h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="address.street"
                value={profile.address.street}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={profile.address.city}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={profile.address.state}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-4">
              <Form.Label>Pincode</Form.Label>
              <Form.Control
                type="text"
                name="address.pincode"
                value={profile.address.pincode}
                onChange={handleChange}
                pattern="\d{6}"
                required
              />
              <Form.Text className="text-muted">6-digit pincode</Form.Text>
            </Form.Group>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminProfile;
