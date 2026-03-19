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

  useEffect(() => {
    if (!user?.role || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user, navigate, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const url = filterStatus
        ? `/admin/bookings?status=${filterStatus}`
        : '/admin/bookings';
      const response = await api.get(url);
      setBookings(response.data.bookings || response.data.data || []);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
    } catch (err) {
      setError('Failed to update booking status');
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      accepted: 'info',
      rejected: 'danger',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'dark'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'];
    return allStatuses.filter(status => status !== currentStatus);
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
        <h1>Manage All Bookings</h1>
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
              <option value="accepted">Accepted</option>
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
              <th>Provider</th>
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
                <td>{booking.provider?.name || 'N/A'}</td>
                <td>{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}</td>
                <td>{booking.scheduledTime || 'N/A'}</td>
                <td>{booking.duration} hrs</td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>₹{booking.totalPrice || 0}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Details
                    </Button>
                    <Form.Select
                      size="sm"
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      disabled={actionLoading === booking._id}
                      style={{ width: '120px' }}
                    >
                      <option value={booking.status}>{booking.status}</option>
                      {getStatusOptions(booking.status).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
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

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
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
                <Col md={6}>
                  <h6>Customer Details</h6>
                  <p><strong>Name:</strong> {selectedBooking.customer?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.customer?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.customer?.phone}</p>
                </Col>
                <Col md={6}>
                  <h6>Provider Details</h6>
                  <p><strong>Name:</strong> {selectedBooking.provider?.name}</p>
                  <p><strong>Email:</strong> {selectedBooking.provider?.email}</p>
                  <p><strong>Phone:</strong> {selectedBooking.provider?.phone}</p>
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
                    <h6>Additional Notes</h6>
                    <p>{selectedBooking.notes}</p>
                  </Col>
                </Row>
              )}
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
