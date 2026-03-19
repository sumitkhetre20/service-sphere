import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor'; // Fixed: Using api instead of axios
import { useAuth } from '../../context/AuthContext';

const AddService = () => {
  const [service, setService] = useState({
    name: '',
    description: '',
    category: '',
    price: {
      basePrice: '',
      unit: 'hour'
    },
    availability: {
      monday: { available: true, startTime: '09:00', endTime: '18:00' },
      tuesday: { available: true, startTime: '09:00', endTime: '18:00' },
      wednesday: { available: true, startTime: '09:00', endTime: '18:00' },
      thursday: { available: true, startTime: '09:00', endTime: '18:00' },
      friday: { available: true, startTime: '09:00', endTime: '18:00' },
      saturday: { available: false, startTime: '09:00', endTime: '18:00' },
      sunday: { available: false, startTime: '09:00', endTime: '18:00' }
    }
  });
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setAuthLoading(false);
      return;
    }
    
    setAuthLoading(false);
    
    if (user.role && user.role !== 'provider') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setService(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setService(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setService(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('=== FRONTEND SUBMISSION START ===');
      console.log('Service data to submit:', service);
      console.log('Service data JSON:', JSON.stringify(service, null, 2));
      
      const response = await api.post('/provider/services', service);
      console.log('=== API RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        setSuccess('Service added successfully!');
        // Reset form
        setService({
          name: '',
          description: '',
          category: '',
          price: {
            basePrice: '',
            unit: 'hour'
          },
          availability: {
            monday: { available: true, startTime: '09:00', endTime: '18:00' },
            tuesday: { available: true, startTime: '09:00', endTime: '18:00' },
            wednesday: { available: true, startTime: '09:00', endTime: '18:00' },
            thursday: { available: true, startTime: '09:00', endTime: '18:00' },
            friday: { available: true, startTime: '09:00', endTime: '18:00' },
            saturday: { available: false, startTime: '09:00', endTime: '18:00' },
            sunday: { available: false, startTime: '09:00', endTime: '18:00' }
          }
        });
        
        // Redirect to services list after a delay
        setTimeout(() => {
          navigate('/provider/services');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to add service');
      }
    } catch (err) {
      console.log('=== FRONTEND ERROR ===');
      console.log('Error object:', err);
      console.log('Error response:', err.response);
      console.log('Error message:', err.message);
      
      setError(err.response?.data?.message || 'Failed to add service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Home Cleaning',
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Beauty & Wellness',
    'Fitness',
    'Tutoring',
    'Photography',
    'Event Planning',
    'Other'
  ];

  if (authLoading) {
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
      <h1 className="mb-4">Add New Service</h1>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Service Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={handleChange}
                    placeholder="e.g., Home Cleaning Service"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={service.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={service.description}
                onChange={handleChange}
                placeholder="Describe your service in detail..."
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price.basePrice"
                    value={service.price.basePrice}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    step="0.01"
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price Unit *</Form.Label>
                  <Form.Select
                    name="price.unit"
                    value={service.price.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="month">Per Month</option>
                    <option value="quarter">Per Quarter</option>
                    <option value="year">Per Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {Object.entries(service.availability).map(([day, availability]) => (
              <Row key={day} className="mb-3">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="text-capitalize">{day}</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Available"
                      checked={availability.available}
                      onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={availability.startTime}
                      onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                      disabled={!availability.available}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={availability.endTime}
                      onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                      disabled={!availability.available}
                    />
                  </Form.Group>
                </Col>
              </Row>
            ))}

            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              className="w-100 mt-4"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Adding Service...
                </>
              ) : (
                'Add Service'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddService;
