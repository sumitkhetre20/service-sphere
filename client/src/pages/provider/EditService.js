import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState({
    name: '',
    description: '',
    category: '',
    price: {
      basePrice: '',
      unit: 'hour'
    },
    duration: 1
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

    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        if (response.data.success && response.data.data) {
          setService(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch service.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, user, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/services/${id}`, service);

      if (response.data.success) {
        setSuccess('Service updated successfully!');
        setTimeout(() => {
          navigate('/provider/services');
        }, 1500);
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service.');
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
      <h1 className="mb-4">Edit Service</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={service.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={service.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price.basePrice"
                    value={service.price?.basePrice}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price Unit</Form.Label>
                  <Form.Select
                    name="price.unit"
                    value={service.price?.unit}
                    onChange={handleChange}
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="month">Per Month</option>
                    <option value="year">Per Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={service.duration}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              type="submit"
              variant="primary"
              disabled={updating}
              className="w-100"
            >
              {updating ? (
                <>
                  <Spinner as="span" animation="border" size="sm" /> Updating...
                </>
              ) : (
                'Update Service'
              )}
            </Button>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditService;
