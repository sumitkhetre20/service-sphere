import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Badge, Row, Col } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log('ServiceList useEffect - user:', user);
    if (!user?.role || user.role !== 'provider') {
      console.log('Not a provider, redirecting');
      navigate('/');
      return;
    }
    fetchServices();
  }, [user, navigate]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/provider/services/my-services');
      setServices(response.data.services);
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
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      setActionLoading(serviceId);
      await api.delete(`/provider/services/${serviceId}`);
      setServices(prev => prev.filter(service => service._id !== serviceId));
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      console.error('Error deleting service:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (serviceId) => {
    try {
      setActionLoading(serviceId);
      const service = services.find(s => s._id === serviceId);
      const newStatus = !service.isActive;
      
      await api.put(`/provider/services/${serviceId}/toggle-active`, { isActive: newStatus });
      
      setServices(prev => prev.map(s => 
        s._id === serviceId ? { ...s, isActive: newStatus } : s
      ));
    } catch (err) {
      setError('Failed to update service status. Please try again.');
      console.error('Error updating service status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Services</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/provider/add-service')}
        >
          Add New Service
        </Button>
      </div>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      {services.length === 0 && !loading && (
        <div className="text-center py-5">
          <h4 className="text-muted">No services found</h4>
          <p className="text-muted">Start by adding your first service</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/provider/add-service')}
          >
            Add Your First Service
          </Button>
        </div>
      )}
      
      <Row>
        {services && services.length > 0 ? services.map(service => {
          console.log('Rendering service:', service);
          return (
          <Col md={6} lg={4} key={service._id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title as="h5" className="mb-0">{service.name || 'N/A'}</Card.Title>
                    <div>
                      <Badge bg={service.isActive ? 'success' : 'secondary'}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Badge bg="info" className="mb-2">{service.category || 'N/A'}</Badge>
                  
                  <Card.Text className="text-muted small mb-3">
                    {service.description || 'No description'}
                  </Card.Text>
                  
                  <div className="mb-3">
                    <strong>Price:</strong> ₹{service.price?.basePrice || 0}/{service.price?.unit || 'hour'}
                  </div>
                  
                  <div className="mb-3">
                    <strong>Duration:</strong> {service.duration ? `${service.duration} hours` : 'N/A'}
                  </div>
                </div>
                
                <div className="mt-auto">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(service._id)}
                      disabled={actionLoading === service._id}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleToggleActive(service._id)}
                      disabled={actionLoading === service._id}
                    >
                      {actionLoading === service._id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        service.isActive ? 'Deactivate' : 'Activate'
                      )}
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(service._id)}
                      disabled={actionLoading === service._id}
                    >
                      {actionLoading === service._id ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Delete'
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
        </Col>
        );
        }) : <div className="text-center w-100">No services to display</div>}
      </Row>
    </Container>
  );
};

export default ServiceList;
