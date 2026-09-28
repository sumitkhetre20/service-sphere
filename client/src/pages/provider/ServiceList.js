import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/ui/EmptyState';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaBan, FaRegClock } from 'react-icons/fa';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchServices();
  }, [user, navigate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/provider/services/my-services');
      setServices(response.data.services || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (serviceId) => {
    navigate(`/provider/edit-service/${serviceId}`);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to permanently delete this service?')) {
      return;
    }

    try {
      setActionLoading(serviceId);
      await api.delete(`/provider/services/${serviceId}`);
      setServices(prev => prev.filter(service => service._id !== serviceId));
      toast.success('Service removed from catalog.');
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      toast.error('Could not delete service.');
      console.error('Error deleting service:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (serviceId) => {
    try {
      setActionLoading(serviceId);
      const targetService = services.find(s => s._id === serviceId);
      const newStatus = !targetService.isActive;

      await api.put(`/provider/services/${serviceId}/toggle-active`, { isActive: newStatus });

      setServices(prev =>
        prev.map(s => (s._id === serviceId ? { ...s, isActive: newStatus } : s))
      );
      toast.info(`Service ${newStatus ? 'activated' : 'paused'}.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service status.');
      toast.error('Status update failed.');
      console.error('Error updating service status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading catalog services...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">My Service Catalog</h2>
            <p className="text-muted small mb-0">Publish, modify rates, and control active status of your offerings.</p>
          </div>
          <Button
            as={Link}
            to="/provider/add-service"
            variant="primary"
            className="d-inline-flex align-items-center gap-2 px-3 fw-semibold shadow-sm"
          >
            <FaPlus size={12} /> Add New Service
          </Button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {services.length === 0 && !loading ? (
          <Card className="border-0 shadow-sm rounded-4 p-5 bg-white text-center">
            <EmptyState
              icon="🛠️"
              title="No Services Published"
              description="You have not created any service listings yet. Create your first service to start receiving customer bookings."
              actionText="Add Your First Service"
              actionLink="/provider/add-service"
            />
          </Card>
        ) : (
          <Row className="g-4">
            {services.map((service) => (
              <Col md={6} lg={4} key={service._id}>
                <Card className="service-card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column bg-white">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        service.images?.[0] ||
                        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80'
                      }
                      style={{ height: '180px', objectFit: 'cover' }}
                      alt={service.name}
                    />
                    <Badge
                      bg={service.isActive ? 'success' : 'secondary'}
                      className="position-absolute top-0 end-0 m-3 px-3 py-2 shadow-sm rounded-pill"
                    >
                      {service.isActive ? 'Live & Bookable' : 'Paused / Inactive'}
                    </Badge>
                  </div>

                  <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-dark mb-0">{service.name}</h5>
                    </div>

                    <div className="mb-2">
                      <Badge bg="primary-soft" className="text-primary text-capitalize">
                        {service.category?.replace('-', ' ')}
                      </Badge>
                    </div>

                    <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: '1.6' }}>
                      {service.description?.length > 100
                        ? `${service.description.substring(0, 100)}...`
                        : service.description}
                    </p>

                    <div className="bg-light p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center small">
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Rate</span>
                        <strong className="text-primary fs-6">
                          ₹{service.price?.basePrice}/{service.price?.unit || 'hr'}
                        </strong>
                      </div>
                      <div className="text-end">
                        <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Est. Time</span>
                        <span className="text-dark fw-semibold d-flex align-items-center gap-1">
                          <FaRegClock size={11} /> {service.duration || 1} hr(s)
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-top d-flex gap-2 justify-content-between">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="d-flex align-items-center gap-1 px-3 fw-semibold"
                        onClick={() => handleEdit(service._id)}
                        disabled={actionLoading === service._id}
                      >
                        <FaEdit size={12} /> Edit
                      </Button>

                      <Button
                        variant={service.isActive ? 'outline-warning' : 'outline-success'}
                        size="sm"
                        className="d-flex align-items-center gap-1 px-2 fw-semibold"
                        onClick={() => handleToggleActive(service._id)}
                        disabled={actionLoading === service._id}
                      >
                        {actionLoading === service._id ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : service.isActive ? (
                          <>
                            <FaBan size={11} /> Pause
                          </>
                        ) : (
                          <>
                            <FaCheckCircle size={11} /> Activate
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="d-flex align-items-center gap-1 px-2"
                        onClick={() => handleDelete(service._id)}
                        disabled={actionLoading === service._id}
                        title="Delete Service"
                      >
                        {actionLoading === service._id ? (
                          <Spinner as="span" animation="border" size="sm" />
                        ) : (
                          <FaTrash size={11} />
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ServiceList;
