import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Form, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { FaCalendarAlt, FaClock, FaEye, FaMapMarkerAlt, FaUserCheck, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

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
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading your bookings list...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Provider Bookings Dispatch</h2>
            <p className="text-muted small mb-0">View all customer appointments and adjust execution status in real time.</p>
          </div>
          <Button variant="outline-primary" size="sm" onClick={() => setFilterStatus('')} className="px-3">
            Reset Filters
          </Button>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Filter Card */}
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <Row className="align-items-center g-3">
            <Col md={4}>
              <Form.Label className="small fw-semibold text-muted mb-1">Filter by Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="sm"
              >
                <option value="">All Statuses ({bookings.length})</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>
          </Row>
        </Card>

        {/* Bookings Table Card */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <Card.Body className="p-0">
            {bookings.length === 0 ? (
              <div className="p-5 text-center">
                <EmptyState
                  icon="📋"
                  title="No Bookings Matching Filter"
                  description="You have no service orders matching the selected filter criteria."
                  actionText="Clear Filter"
                  onAction={() => setFilterStatus('')}
                />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Service</th>
                      <th>Customer Details</th>
                      <th>Scheduled Slot</th>
                      <th>Duration</th>
                      <th>Total Value</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="ps-4 py-3">
                          <strong className="text-dark d-block">{booking.service?.name || 'N/A'}</strong>
                          <span className="text-muted small">#{booking._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark">{booking.customer?.name || 'N/A'}</div>
                          <span className="text-muted small d-block">{booking.customer?.phone}</span>
                        </td>
                        <td>
                          <div className="small text-dark fw-semibold">
                            {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <span className="text-muted small">{booking.scheduledTime || 'N/A'}</span>
                        </td>
                        <td>{booking.duration || 1} hr(s)</td>
                        <td>
                          <strong className="text-success fs-6">₹{booking.totalPrice || 0}</strong>
                        </td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="text-end pe-4">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-inline-flex align-items-center gap-1 px-3 py-1 fw-semibold"
                            onClick={() => handleViewDetails(booking)}
                          >
                            <FaEye size={12} /> Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Details & Status Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Appointment Management</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {selectedBooking && (
              <div>
                <div className="p-3 bg-light rounded-3 mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{selectedBooking.service?.name}</h5>
                    <span className="text-muted small">Base Rate: ₹{selectedBooking.service?.price?.basePrice}</span>
                  </div>
                  <div className="text-end">
                    <StatusBadge status={selectedBooking.status} />
                    <div className="fw-bold text-primary fs-5 mt-1">₹{selectedBooking.totalPrice}</div>
                  </div>
                </div>

                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Customer Info</h6>
                      <div className="fw-semibold text-dark mb-1">{selectedBooking.customer?.name}</div>
                      <div className="text-muted small mb-1 d-flex align-items-center gap-1">
                        <FaEnvelope size={11} /> {selectedBooking.customer?.email}
                      </div>
                      <div className="text-muted small d-flex align-items-center gap-1">
                        <FaPhoneAlt size={11} /> {selectedBooking.customer?.phone}
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Schedule & Location</h6>
                      <div className="small text-dark mb-1 d-flex align-items-center gap-1">
                        <FaCalendarAlt size={12} className="text-primary" />
                        {new Date(selectedBooking.scheduledDate).toLocaleDateString()} at {selectedBooking.scheduledTime}
                      </div>
                      <div className="small text-muted d-flex align-items-start gap-1">
                        <FaMapMarkerAlt size={12} className="mt-1 flex-shrink-0" />
                        <span>
                          {selectedBooking.address?.street}, {selectedBooking.address?.city}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                {selectedBooking.notes && (
                  <div className="p-3 bg-light rounded-3 mb-4 small">
                    <strong>Special Instructions:</strong> {selectedBooking.notes}
                  </div>
                )}

                <div className="pt-3 border-top">
                  <h6 className="fw-bold text-dark mb-2">Update Dispatch Status</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {getStatusOptions(selectedBooking.status).map((status) => (
                      <Button
                        key={status}
                        variant={getStatusButtonVariant(status)}
                        size="sm"
                        className="px-3 py-2 fw-semibold text-capitalize"
                        onClick={() => handleStatusChange(selectedBooking._id, status)}
                        disabled={actionLoading === selectedBooking._id}
                      >
                        {actionLoading === selectedBooking._id ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Updating...
                          </>
                        ) : (
                          `Mark as ${status}`
                        )}
                      </Button>
                    ))}
                  </div>
                  {getStatusOptions(selectedBooking.status).length === 0 && (
                    <p className="text-muted small mb-0 mt-2">
                      This booking has concluded ({selectedBooking.status}). No additional status changes available.
                    </p>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageBookings;
