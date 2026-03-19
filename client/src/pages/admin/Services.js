import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchServices();
  }, [user, navigate]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/services');
      setServices(response.data.services);
    } catch (err) {
      setError('Failed to fetch services. Please try again.');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (serviceId) => {
    try {
      setActionLoading(serviceId);
      setError(''); // Clear any previous errors
      await api.put(`/admin/services/${serviceId}/deactivate`);
      await fetchServices(); // Refresh the list
    } catch (err) {
      setError('Failed to deactivate service. Please try again.');
      console.error('Error deactivating service:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (serviceId) => {
    try {
      setActionLoading(serviceId);
      setError(''); // Clear any previous errors
      await api.put(`/admin/services/${serviceId}/activate`);
      await fetchServices(); // Refresh the list
    } catch (err) {
      setError('Failed to activate service. Please try again.');
      console.error('Error activating service:', err);
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
      <h1 className="mb-4">Manage Services</h1>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Provider</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>
                <Badge bg="info">{service.category}</Badge>
              </td>
              <td>₹{service.price.basePrice}/{service.price.unit}</td>
              <td>{service.provider?.name || 'Unknown'}</td>
              <td>
                <Badge bg={service.isActive ? 'success' : 'danger'}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <div className="d-flex gap-2">
                  {service.isActive && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeactivate(service._id)}
                      disabled={actionLoading === service._id}
                    >
                      {actionLoading === service._id ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" /> Deactivating...
                        </>
                      ) : (
                        'Deactivate'
                      )}
                    </Button>
                  )}
                  
                  {!service.isActive && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleActivate(service._id)}
                      disabled={actionLoading === service._id}
                    >
                      {actionLoading === service._id ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" /> Activating...
                        </>
                      ) : (
                        'Activate'
                      )}
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {services.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">No services found.</p>
        </div>
      )}
    </Container>
  );
};

export default AdminServices;
