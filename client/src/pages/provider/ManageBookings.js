import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Badge, Form, Row, Col, Button, Modal } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const url = filterStatus 
        ? `/bookings/provider?status=${filterStatus}`
        : '/bookings/provider';
      const response = await api.get(url);
      setBookings(response.data.data || response.data.bookings || []);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    if (!user?.role || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user, navigate, filterStatus, fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
      setShowModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update booking status';
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'info',
      rejected: 'danger',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'dark'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getStatusOptions = (currentStatus) => {
    const validTransitions = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      rejected: [],
      completed: [],
      cancelled: []
    };

    return validTransitions[currentStatus] || [];
  };

  const getStatusButtonVariant = (status) => {
    const variants = {
      confirmed: 'success',
      rejected: 'danger',
      'in-progress': 'primary',
      completed: 'info',
      cancelled: 'warning'
    };
    return variants[status] || 'secondary';
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
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
        <h1>Manage My Bookings</h1>
        <Button variant="outline-secondary" onClick={() => setFilterStatus('')}>
          Reset Filters
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Service</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.service?.name || 'N/A'}</td>
                <td>{booking.customer?.name || 'N/A'}</td>
                <td>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}</td>
                <td>{booking.scheduledTime || 'N/A'}</td>
                <td>{booking.duration} hrs</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>₹{booking.totalPrice || 0}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetails(booking)}
                  >
                    View & Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {bookings.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">No bookings found.</p>
        </div>
      )}

      {/* Details & Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details & Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h6>Service Information</h6>
                  <p><strong>Service:</strong> {selectedBooking.service?.name}</p>
                  <p><strong>Description:</strong> {selectedBooking.service?.description}</p>
                  <p><strong>Base Price:</strong> ₹{selectedBooking.service?.price?.basePrice}</p>
                </Col>
                <Col md={6}>
                  <h6>Booking Information</h6>
                  <p><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</p>
                  <p><strong>Total Price:</strong> ₹{selectedBooking.totalPrice}</p>
                  <p><strong>Duration:</strong> {selectedBooking.duration} hours</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <h6>Customer Details</h6>
                  <p><strong>Name:</strong> {selectedBooking.customer?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.customer?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.customer?.phone}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6>Scheduled Date & Time</h6>
                  <p><strong>Date:</strong> {new Date(selectedBooking.scheduledDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedBooking.scheduledTime}</p>
                </Col>
                <Col md={6}>
                  <h6>Service Address</h6>
                  <p><strong>Street:</strong> {selectedBooking.address?.street || 'N/A'}</p>
                  <p><strong>City:</strong> {selectedBooking.address?.city || 'N/A'}</p>
                  <p><strong>State:</strong> {selectedBooking.address?.state || 'N/A'}</p>
                  <p><strong>Pincode:</strong> {selectedBooking.address?.pincode || 'N/A'}</p>
                </Col>
              </Row>

              {selectedBooking.notes && (
                <Row className="mb-3">
                  <Col>
                    <h6>Customer Notes</h6>
                    <p>{selectedBooking.notes}</p>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col md={12}>
                  <h6>Update Booking Status</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {getStatusOptions(selectedBooking.status).map((status) => (
                      <Button
                        key={status}
                        variant={getStatusButtonVariant(status)}
                        size="sm"
                        onClick={() => handleStatusChange(selectedBooking._id, status)}
                        disabled={actionLoading === selectedBooking._id}
                      >
                        {actionLoading === selectedBooking._id ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Updating...
                          </>
                        ) : (
                          `Mark as ${status}`
                        )}
                      </Button>
                    ))}
                  </div>
                  {getStatusOptions(selectedBooking.status).length === 0 && (
                    <p className="text-muted mt-2">No valid status transitions available for this booking.</p>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageBookings;
