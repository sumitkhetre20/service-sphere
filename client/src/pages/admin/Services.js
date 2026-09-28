import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Badge, Card, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { FaSearch, FaCheck, FaBan } from 'react-icons/fa';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
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
      setError('');
      const response = await api.get('/admin/services');
      setServices(response.data.services || []);
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
      setError('');
      await api.put(`/admin/services/${serviceId}/deactivate`);
      toast.info('Service deactivated successfully.');
      await fetchServices();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to deactivate service.';
      setError(msg);
      toast.error(msg);
      console.error('Error deactivating service:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (serviceId) => {
    try {
      setActionLoading(serviceId);
      setError('');
      await api.put(`/admin/services/${serviceId}/activate`);
      toast.success('Service activated successfully.');
      await fetchServices();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to activate service.';
      setError(msg);
      toast.error(msg);
      console.error('Error activating service:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredServices = services.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.provider?.name?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Platform Service Moderation</h2>
            <p className="text-muted small mb-0">Audit catalog items across providers and manage active publication states.</p>
          </div>
          <Badge bg="primary" className="px-3 py-2 fs-6 rounded-pill">
            {services.length} Listed Services
          </Badge>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Filter Card */}
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <Row className="g-3 align-items-center">
            <Col md={8}>
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={13} />
                <Form.Control
                  type="text"
                  placeholder="Filter by service name, category, or provider..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  size="sm"
                />
              </div>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-secondary" size="sm" onClick={() => setSearch('')}>
                Clear Filter
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Services Table Card */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <Card.Body className="p-0">
            {filteredServices.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <p className="mb-0">No services match your search criteria.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Service</th>
                      <th>Category</th>
                      <th>Base Price</th>
                      <th>Offering Provider</th>
                      <th>Current State</th>
                      <th className="text-end pe-4">Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service._id}>
                        <td className="ps-4 py-3">
                          <strong className="text-dark d-block">{service.name}</strong>
                          <span className="text-muted small">#{service._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>
                          <Badge bg="primary-soft" className="text-primary text-capitalize">
                            {service.category?.replace('-', ' ')}
                          </Badge>
                        </td>
                        <td>
                          <strong className="text-dark">₹{service.price?.basePrice}</strong>
                          <span className="text-muted small">/{service.price?.unit || 'hr'}</span>
                        </td>
                        <td>
                          <span className="fw-semibold text-dark d-block">
                            {service.provider?.name || 'Unknown'}
                          </span>
                          <span className="text-muted small">{service.provider?.phone}</span>
                        </td>
                        <td>
                          {service.isActive ? (
                            <span className="badge bg-success-soft text-success px-2 py-1 small fw-semibold">
                              Live & Active
                            </span>
                          ) : (
                            <span className="badge bg-danger-soft text-danger px-2 py-1 small fw-semibold">
                              Deactivated
                            </span>
                          )}
                        </td>
                        <td className="text-end pe-4">
                          {service.isActive ? (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="d-inline-flex align-items-center gap-1 px-3 fw-semibold"
                              onClick={() => handleDeactivate(service._id)}
                              disabled={actionLoading === service._id}
                            >
                              {actionLoading === service._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                <>
                                  <FaBan size={11} /> Deactivate
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline-success"
                              size="sm"
                              className="d-inline-flex align-items-center gap-1 px-3 fw-semibold"
                              onClick={() => handleActivate(service._id)}
                              disabled={actionLoading === service._id}
                            >
                              {actionLoading === service._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                <>
                                  <FaCheck size={11} /> Activate
                                </>
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminServices;
