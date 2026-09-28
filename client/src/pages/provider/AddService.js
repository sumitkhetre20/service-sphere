import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const AddService = () => {
  const [service, setService] = useState({
    name: '',
    description: '',
    category: '',
    price: {
      basePrice: '',
      unit: 'hour'
    },
    duration: 1,
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
      const payload = {
        ...service,
        duration: Number(service.duration) || 1,
        price: {
          ...service.price,
          basePrice: Number(service.price.basePrice)
        }
      };

      const response = await api.post('/provider/services', payload);
      if (response.data.success) {
        setSuccess('Service added successfully to your catalog!');
        toast.success('Service published successfully!');
        setTimeout(() => {
          navigate('/provider/services');
        }, 1200);
      } else {
        setError(response.data.message || 'Failed to add service');
      }
    } catch (err) {
      console.error('Error adding service:', err);
      const msg = err.response?.data?.message || 'Failed to create service listing.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'Home Cleaning', value: 'home-cleaning' },
    { label: 'Plumbing', value: 'plumbing' },
    { label: 'Electrical', value: 'electrical' },
    { label: 'Carpentry', value: 'carpentry' },
    { label: 'Painting', value: 'painting' },
    { label: 'Beauty & Wellness', value: 'beauty' },
    { label: 'Fitness & Yoga', value: 'fitness' },
    { label: 'Tutoring', value: 'tutoring' },
    { label: 'Photography', value: 'photography' },
    { label: 'Event Planning', value: 'event-planning' },
    { label: 'Other Services', value: 'other' }
  ];

  if (authLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="ss-spinner"></div>
      </Container>
    );
  }

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        <div className="mb-4">
          <Link to="/provider/services" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 mb-2">
            <FaArrowLeft size={12} /> Back to Catalog
          </Link>
          <h2 className="fw-bold text-dark mb-1">Create New Service Offering</h2>
          <p className="text-muted small mb-0">Publish a new service to attract bookings from homeowners.</p>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <Form onSubmit={handleSubmit}>
            <h5 className="fw-bold text-dark mb-3">1. Service Particulars</h5>
            <Row className="g-3 mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Service Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={handleChange}
                    placeholder="e.g. Master Bathroom Sanitization & Deep Clean"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={service.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Detailed Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={service.description}
                    onChange={handleChange}
                    placeholder="Describe what's included in this service, equipment used, and duration requirements..."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="fw-bold text-dark mb-3">2. Pricing & Duration</h5>
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Base Price (₹) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price.basePrice"
                    value={service.price.basePrice}
                    onChange={handleChange}
                    placeholder="499"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Pricing Unit *</Form.Label>
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

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Typical Duration (Hours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={service.duration}
                    onChange={handleChange}
                    min="1"
                    placeholder="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="fw-bold text-dark mb-3">3. Weekly Availability Schedule</h5>
            <div className="bg-light p-3 rounded-4 mb-4">
              {Object.entries(service.availability).map(([day, availability]) => (
                <Row key={day} className="align-items-center g-2 py-2 border-bottom">
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      id={`avail-${day}`}
                      label={<span className="fw-bold text-capitalize text-dark">{day}</span>}
                      checked={availability.available}
                      onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                    />
                  </Col>

                  <Col md={4}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted">From:</span>
                      <Form.Control
                        type="time"
                        size="sm"
                        value={availability.startTime}
                        onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                        disabled={!availability.available}
                      />
                    </div>
                  </Col>

                  <Col md={4}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="small text-muted">To:</span>
                      <Form.Control
                        type="time"
                        size="sm"
                        value={availability.endTime}
                        onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                        disabled={!availability.available}
                      />
                    </div>
                  </Col>
                </Row>
              ))}
            </div>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button as={Link} to="/provider/services" variant="secondary" className="px-4">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="px-4 fw-bold shadow-sm"
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Publishing Service...
                  </>
                ) : (
                  'Publish Service'
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default AddService;
