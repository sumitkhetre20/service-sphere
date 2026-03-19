import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Button, Alert } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0
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
      
      // Fetch all customer bookings
      const response = await api.get('/bookings/customer', { params: { limit: 100 } });
      const bookings = response.data.data;
      
      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalSpent = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
      
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalSpent
      });
      
      setAllBookings(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setActionLoading(bookingId);
      setError('');
      setSuccess('');
      
      await api.put(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by customer' });
      setSuccess('Booking cancelled successfully!');
      
      // Refresh bookings
      await fetchDashboardData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('Failed to cancel booking. Please try again.');
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
        <h1>Customer Dashboard</h1>
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
              <h3 className="text-info">₹{stats.totalSpent}</h3>
              <p className="mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Browse Services Button */}
      <Card className="mb-4">
        <Card.Body className="text-center">
          <h5 className="mb-3">Need more services?</h5>
          <Button 
            variant="primary" 
            onClick={() => navigate('/services')}
            size="lg"
          >
            Browse Available Services
          </Button>
        </Card.Body>
      </Card>

      {/* All Bookings */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Your Bookings</h5>
        </Card.Header>
        <Card.Body>
          {allBookings.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No bookings yet</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/services')}
              >
                Browse Services
              </Button>
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
                        Provider: {booking.provider?.name}
                      </small>
                      <br />
                      <small className="text-muted">
                        {booking.provider?.phone}
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
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={actionLoading === booking._id}
                        >
                          {actionLoading === booking._id ? (
                            <Spinner as="span" animation="border" size="sm" />
                          ) : (
                            'Cancel'
                          )}
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => navigate(`/services/${booking.service._id}`)}
                        >
                          Book Again
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

export default CustomerDashboard;
