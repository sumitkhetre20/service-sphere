import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await api.get('/bookings/customer', { params });
      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page]);

  useEffect(() => {
    fetchBookings();
  }, [filter, pagination.page, fetchBookings]);

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

  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${bookingId}/cancel`, { reason: 'Cancelled by customer' });
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
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
        <h1>My Bookings</h1>
        <div>
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'in-progress' ? 'primary' : 'outline-primary'}
            className="me-2"
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === 'completed' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <h3>No bookings found</h3>
          <p className="text-muted">
            {filter === 'all' 
              ? "You haven't made any bookings yet. Start by browsing services!"
              : `No ${filter} bookings found.`
            }
          </p>
          <Button href="/services" variant="primary">
            Browse Services
          </Button>
        </div>
      ) : (
        <Row>
          {bookings.map((booking) => (
            <Col md={6} lg={4} className="mb-4" key={booking._id}>
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{booking.service?.name}</Card.Title>
                    <Badge bg={getStatusBadge(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  
                  <Card.Text className="text-muted mb-2">
                    Provider: {booking.provider?.name}
                  </Card.Text>
                  
                  <div className="mb-2">
                    <small>
                      <strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}<br />
                      <strong>Time:</strong> {booking.scheduledTime}<br />
                      <strong>Duration:</strong> {booking.duration} hour(s)<br />
                      <strong>Total:</strong> ₹{booking.totalPrice}
                    </small>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Address:</strong><br />
                      {booking.address.street}, {booking.address.city}, 
                      {booking.address.state} - {booking.address.pincode}
                    </small>
                  </div>

                  {booking.notes && (
                    <div className="mb-2">
                      <small>
                        <strong>Notes:</strong> {booking.notes}
                      </small>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </small>
                    {booking.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="btn-group">
            <Button
              variant="outline-primary"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <span className="btn btn-outline-primary" disabled>
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline-primary"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CustomerBookings;
