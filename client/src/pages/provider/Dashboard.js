import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Alert } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalEarnings: 0
  });
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all bookings to calculate stats
      const response = await api.get('/bookings/provider', { params: { limit: 100 } });
      const bookings = response.data.bookings || response.data.data || [];
      
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalEarnings = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        totalEarnings
      });
      
      setAllBookings(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      console.log('Final allBookings state:', bookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      setActionLoading(bookingId);
      setError('');
      setSuccess('');
      
      await api.put(`/bookings/${bookingId}/status`, { status: action });
      setSuccess(`Booking ${action} successfully!`);
      
      // Refresh bookings
      await fetchDashboardData();
    } catch (error) {
      console.error('Error updating booking:', error);
      setError(`Failed to ${action} booking. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'warning',
      'accepted': 'info',
      'in-progress': 'primary',
      'completed': 'success',
      'cancelled': 'danger',
      'rejected': 'danger'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Provider Dashboard</h1>
        <div>
          Welcome back, <strong>{user?.name}</strong>!
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.totalBookings}</h3>
              <p className="mb-0">Total Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.pendingBookings}</h3>
              <p className="mb-0">Pending Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.completedBookings}</h3>
              <p className="mb-0">Completed Bookings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">₹{stats.totalEarnings}</h3>
              <p className="mb-0">Total Earnings</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Customer Bookings Management Section */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">📋 Customer Bookings Management</h5>
          <small className="text-white-50">Manage all customer service bookings</small>
        </Card.Header>
        <Card.Body>
          {allBookings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No customer bookings yet</p>
              <small className="text-muted">
                When customers book your services, they will appear here for management
              </small>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <h6>Active Bookings ({allBookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'in-progress').length})</h6>
              </div>
              {allBookings.map((booking) => (
                <div key={booking._id} className="border rounded p-3 mb-3 bg-light">
                  <Row className="align-items-center">
                    <Col md={4}>
                      <div className="d-flex align-items-center mb-2">
                        <strong className="text-primary">{booking.service?.name}</strong>
                        <Badge bg={getStatusBadge(booking.status)} className="ms-2">
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="customer-info">
                        <small className="text-muted d-block">
                          <strong>👤 Customer:</strong> {booking.customer?.name}
                        </small>
                        <small className="text-muted d-block">
                          <strong>📧 Email:</strong> {booking.customer?.email}
                        </small>
                        <small className="text-muted d-block">
                          <strong>📞 Phone:</strong> {booking.customer?.phone}
                        </small>
                        {booking.customer?.address && (
                          <small className="text-muted d-block">
                            <strong>📍 Address:</strong> {booking.customer?.address?.street}, {booking.customer?.address?.city}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="booking-details">
                        <small className="d-block">
                          <strong>📅 Date:</strong><br />
                          {new Date(booking.scheduledDate).toLocaleDateString()}
                        </small>
                        <small className="d-block mt-1">
                          <strong>⏰ Time:</strong><br />
                          {booking.scheduledTime}
                        </small>
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="price-details">
                        <small className="d-block">
                          <strong>💰 Price:</strong><br />
                          <span className="text-success fs-6">₹{booking.totalPrice}</span>
                        </small>
                        {booking.notes && (
                          <small className="d-block mt-2 text-muted">
                            <strong>📝 Notes:</strong><br />
                            {booking.notes}
                          </small>
                        )}
                      </div>
                    </Col>
                    <Col md={4} className="text-end">
                      <div className="booking-actions">
                        {booking.status === 'pending' && (
                          <div>
                            <small className="d-block text-muted mb-2">Customer is waiting for your response</small>
                            <div>
                              <Button
                                size="sm"
                                variant="success"
                                className="me-2"
                                onClick={() => handleBookingAction(booking._id, 'accepted')}
                                disabled={actionLoading === booking._id}
                              >
                                {actionLoading === booking._id ? (
                                  <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                  '✅ Accept Booking'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleBookingAction(booking._id, 'rejected')}
                                disabled={actionLoading === booking._id}
                              >
                                {actionLoading === booking._id ? (
                                  <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                  '❌ Reject'
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                        {booking.status === 'accepted' && (
                          <div>
                            <small className="d-block text-muted mb-2">Booking accepted - Ready to start</small>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleBookingAction(booking._id, 'in-progress')}
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                '🚀 Start Service'
                              )}
                            </Button>
                          </div>
                        )}
                        {booking.status === 'in-progress' && (
                          <div>
                            <small className="d-block text-muted mb-2">Service in progress</small>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleBookingAction(booking._id, 'completed')}
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                '✅ Complete Service'
                              )}
                            </Button>
                          </div>
                        )}
                        {booking.status === 'completed' && (
                          <div>
                            <small className="d-block text-success mb-2">✅ Service Completed</small>
                            <Badge bg="success">Earnings: ₹{booking.totalPrice}</Badge>
                          </div>
                        )}
                        {booking.status === 'rejected' && (
                          <div>
                            <small className="d-block text-danger mb-2">❌ Booking Rejected</small>
                            <Badge bg="danger">Cancelled</Badge>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* All Bookings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">📊 All Bookings History</h5>
        </Card.Header>
        <Card.Body>
          {allBookings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No bookings history</p>
            </div>
          ) : (
            <div>
              {allBookings.map((booking) => (
                <div key={booking._id} className="border-bottom pb-3 mb-3">
                  <Row className="align-items-center">
                    <Col md={3}>
                      <strong>{booking.service?.name}</strong>
                      <br />
                      <small className="text-muted">
                        Customer: {booking.customer?.name}
                      </small>
                      <br />
                      <small className="text-muted">
                        Email: {booking.customer?.email}
                      </small>
                      <br />
                      <small className="text-muted">
                        Phone: {booking.customer?.phone}
                      </small>
                    </Col>
                    <Col md={2}>
                      <small>
                        <strong>Date:</strong><br />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                      </small>
                    </Col>
                    <Col md={2}>
                      <small>
                        <strong>Time:</strong><br />
                        {booking.scheduledTime}
                      </small>
                    </Col>
                    <Col md={2}>
                      <small>
                        <strong>Price:</strong><br />
                        ₹{booking.totalPrice}
                      </small>
                    </Col>
                    <Col md={1}>
                      <Badge bg={getStatusBadge(booking.status)}>
                        {booking.status}
                      </Badge>
                    </Col>
                    <Col md={2} className="text-end">
                      {booking.status === 'pending' && (
                        <div>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleBookingAction(booking._id, 'accepted')}
                            disabled={actionLoading === booking._id}
                          >
                            {actionLoading === booking._id ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              'Accept'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleBookingAction(booking._id, 'rejected')}
                            disabled={actionLoading === booking._id}
                          >
                            {actionLoading === booking._id ? (
                              <Spinner as="span" animation="border" size="sm" />
                            ) : (
                              'Reject'
                            )}
                          </Button>
                        </div>
                      )}
                      {booking.status === 'accepted' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleBookingAction(booking._id, 'in-progress')}
                          disabled={actionLoading === booking._id}
                        >
                          {actionLoading === booking._id ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            'Start'
                          )}
                        </Button>
                      )}
                      {booking.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleBookingAction(booking._id, 'completed')}
                          disabled={actionLoading === booking._id}
                        >
                          {actionLoading === booking._id ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            'Complete'
                          )}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProviderDashboard;
