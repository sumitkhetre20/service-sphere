import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Badge, Form, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import { FaEye, FaMapMarkerAlt } from 'react-icons/fa';

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
      setError('');
      const url = filterStatus
        ? `/admin/bookings?status=${filterStatus}`
        : '/admin/bookings';
      const response = await api.get(url);
      setBookings(response.data.bookings || response.data.data || []);
    } catch (err) {
      setError('Failed to fetch platform bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId);
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking status changed to ${newStatus}`);
      await fetchBookings();
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update booking status';
      setError(msg);
      toast.error(msg);
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const allStatuses = ['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled'];

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

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
            <h2 className="fw-bold text-dark mb-1">Global Bookings Oversight</h2>
            <p className="text-muted small mb-0">Monitor consumer appointments, track disputes, and administer order statuses.</p>
          </div>
          <Badge bg="primary" className="px-3 py-2 fs-6 rounded-pill">
            {bookings.length} Total Bookings
          </Badge>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Filter Card */}
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <Form.Label className="small fw-semibold text-muted mb-1">Filter by Status</Form.Label>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="sm"
              >
                <option value="">All Statuses ({bookings.length})</option>
                {allStatuses.map(st => (
                  <option key={st} value={st} className="text-capitalize">{st}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={8} className="text-md-end pt-md-3">
              <Button variant="outline-secondary" size="sm" onClick={() => setFilterStatus('')}>
                Clear Filter
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Bookings Table Card */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <Card.Body className="p-0">
            {bookings.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <EmptyState
                  icon="📦"
                  title="No Bookings Recorded"
                  description="No customer booking transactions match the current filter selection."
                  actionText="Reset Filter"
                  onAction={() => setFilterStatus('')}
                />
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Service</th>
                      <th>Customer</th>
                      <th>Assigned Provider</th>
                      <th>Slot</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Admin Action</th>
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
                          <span className="fw-semibold text-dark d-block">{booking.customer?.name || 'N/A'}</span>
                          <span className="text-muted small">{booking.customer?.phone}</span>
                        </td>
                        <td>
                          <span className="fw-semibold text-dark d-block">{booking.provider?.name || 'Unassigned'}</span>
                          <span className="text-muted small">{booking.provider?.phone}</span>
                        </td>
                        <td>
                          <span className="small text-dark d-block">
                            {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="text-muted small">{booking.scheduledTime}</span>
                        </td>
                        <td>
                          <strong className="text-success fs-6">₹{booking.totalPrice || 0}</strong>
                        </td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="d-inline-flex align-items-center gap-1 px-3 py-1"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <FaEye size={12} /> View
                            </Button>
                            <Form.Select
                              size="sm"
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              disabled={actionLoading === booking._id}
                              style={{ width: '130px' }}
                            >
                              <option value={booking.status}>{booking.status}</option>
                              {allStatuses
                                .filter(s => s !== booking.status)
                                .map(status => (
                                  <option key={status} value={status}>
                                    Set: {status}
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
            )}
          </Card.Body>
        </Card>

        {/* Details Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Audit Booking Particulars</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {selectedBooking && (
              <div>
                <div className="p-3 bg-light rounded-3 mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{selectedBooking.service?.name}</h5>
                    <span className="text-muted small">Job #{selectedBooking._id}</span>
                  </div>
                  <div className="text-end">
                    <StatusBadge status={selectedBooking.status} />
                    <div className="fw-bold text-success fs-5 mt-1">₹{selectedBooking.totalPrice}</div>
                  </div>
                </div>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Customer Info</h6>
                      <div className="fw-bold text-dark mb-1">{selectedBooking.customer?.name}</div>
                      <div className="text-muted small mb-1">{selectedBooking.customer?.email}</div>
                      <div className="text-muted small">{selectedBooking.customer?.phone}</div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Provider Info</h6>
                      <div className="fw-bold text-dark mb-1">{selectedBooking.provider?.name}</div>
                      <div className="text-muted small mb-1">{selectedBooking.provider?.email}</div>
                      <div className="text-muted small">{selectedBooking.provider?.phone}</div>
                    </div>
                  </Col>
                </Row>

                <div className="p-3 border rounded-3 mb-3">
                  <h6 className="fw-bold text-muted small text-uppercase mb-2">Scheduled Slot & Location</h6>
                  <div className="small text-dark mb-2">
                    Date: <strong>{new Date(selectedBooking.scheduledDate).toLocaleDateString()}</strong> at <strong>{selectedBooking.scheduledTime}</strong> ({selectedBooking.duration} hrs)
                  </div>
                  <div className="small text-muted d-flex align-items-start gap-1">
                    <FaMapMarkerAlt size={12} className="mt-1 flex-shrink-0" />
                    <span>
                      {selectedBooking.address?.street}, {selectedBooking.address?.city}, {selectedBooking.address?.state} - {selectedBooking.address?.pincode}
                    </span>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 bg-light rounded-3 mb-3 small">
                    <strong>Customer Notes:</strong> {selectedBooking.notes}
                  </div>
                )}
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
