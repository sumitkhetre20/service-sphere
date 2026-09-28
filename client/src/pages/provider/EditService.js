import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

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
      const payload = {
        ...service,
        duration: Number(service.duration) || 1,
        price: {
          ...service.price,
          basePrice: Number(service.price.basePrice)
        }
      };

      const response = await api.put(`/services/${id}`, payload);
      if (response.data.success) {
        setSuccess('Service updated successfully!');
        toast.success('Service updated successfully!');
        setTimeout(() => {
          navigate('/provider/services');
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update service.';
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
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
          <h2 className="fw-bold text-dark mb-1">Edit Service Listing</h2>
          <p className="text-muted small mb-0">Update pricing, service scope, and description.</p>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3 mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Service Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={service.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Service Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={service.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Base Price (₹)</Form.Label>
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
                <Form.Group>
                  <Form.Label className="small fw-semibold">Price Unit</Form.Label>
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

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Duration (Hours)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={service.duration}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 pt-3 border-top">
              <Button as={Link} to="/provider/services" variant="secondary" className="px-4">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updating}
                className="px-4 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
              >
                {updating ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <FaSave size={13} /> Update Service
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default EditService;
