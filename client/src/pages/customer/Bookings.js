import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Alert, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import PageHero from '../../components/ui/PageHero';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserCheck,
  FaTimes,
  FaFileInvoiceDollar
} from 'react-icons/fa';

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancelModalId, setCancelModalId] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await api.get('/bookings/customer', { params });
      setBookings(response.data.data || []);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Unable to load your bookings. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  }, [filter, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const confirmCancelBooking = async () => {
    if (!cancelModalId) return;
    try {
      setCancelling(true);
      await api.put(`/bookings/${cancelModalId}/cancel`, { reason: 'Cancelled by customer' });
      toast.success('Booking cancelled successfully.');
      setCancelModalId(null);
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const filterTabs = [
    { label: 'All Bookings', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <>
      <PageHero
        badge="Appointments"
        title="My Bookings & Orders"
        subtitle="Track active service schedules, review service reports, and manage appointment details."
      />

      <Container className="py-5">
        {/* Filter Pills */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? 'primary' : 'outline-secondary'}
                size="sm"
                className="px-3 py-2 fw-semibold rounded-pill"
                onClick={() => {
                  setFilter(tab.value);
                  setPagination(p => ({ ...p, page: 1 }));
                }}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <Button as={Link} to="/services" variant="primary" size="sm" className="px-3 py-2 fw-semibold">
            Book New Service
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4 d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={fetchBookings}>
              Retry
            </Button>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="ss-spinner mx-auto mb-3"></div>
            <p className="text-muted fw-semibold">Retrieving your service history...</p>
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No Bookings Found"
            description={
              filter === 'all'
                ? "You haven't booked any services yet. Find a service to get started!"
                : `You currently have no ${filter} service bookings.`
            }
            actionText="Explore All Services"
            actionLink="/services"
          />
        ) : (
          <Row className="g-4">
            {bookings.map((booking) => (
              <Col md={6} lg={4} key={booking._id}>
                <Card className="booking-card h-100 border-0 shadow-sm d-flex flex-column">
                  <div className="booking-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                    <span className="small text-muted fw-bold">#{booking._id.slice(-6).toUpperCase()}</span>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="booking-body p-4 d-flex flex-column flex-grow-1">
                    <h5 className="fw-bold text-dark mb-1">
                      {booking.service?.name || 'Home Service'}
                    </h5>
                    <div className="d-flex align-items-center gap-2 text-muted small mb-3">
                      <FaUserCheck className="text-primary" /> Provider: {booking.provider?.name || 'Assigned Professional'}
                    </div>

                    <div className="bg-light p-3 rounded-3 mb-3 small d-flex flex-column gap-2">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted d-flex align-items-center gap-1">
                          <FaCalendarAlt size={12} /> Scheduled Date
                        </span>
                        <strong className="text-dark">
                          {booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleDateString() : 'N/A'}
                        </strong>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted d-flex align-items-center gap-1">
                          <FaClock size={12} /> Time Slot
                        </span>
                        <strong className="text-dark">{booking.scheduledTime || '09:00'}</strong>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted d-flex align-items-center gap-1">
                          <FaFileInvoiceDollar size={12} /> Total Amount
                        </span>
                        <strong className="text-primary fs-6">₹{booking.totalPrice}</strong>
                      </div>
                    </div>

                    <div className="mb-3 text-muted small">
                      <span className="d-flex align-items-start gap-1">
                        <FaMapMarkerAlt size={13} className="text-muted mt-1 flex-shrink-0" />
                        <span>
                          {booking.address?.street}, {booking.address?.city} - {booking.address?.pincode}
                        </span>
                      </span>
                    </div>

                    {booking.notes && (
                      <div className="mb-3 p-2 rounded bg-light border text-muted small">
                        <strong>Special notes:</strong> {booking.notes}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Booked {new Date(booking.createdAt).toLocaleDateString()}
                      </span>

                      <div className="d-flex gap-2">
                        {booking.service?._id && (
                          <Link
                            to={`/services/${booking.service._id}`}
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                          >
                            Service
                          </Link>
                        )}
                        {booking.status === 'pending' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="px-2 py-1 d-flex align-items-center gap-1"
                            onClick={() => setCancelModalId(booking._id)}
                          >
                            <FaTimes size={11} /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <div className="btn-group shadow-sm">
              <Button
                variant="outline-primary"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3"
              >
                Previous
              </Button>
              <span className="btn btn-outline-primary active disabled px-4 fw-bold">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline-primary"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        <Modal show={!!cancelModalId} onHide={() => setCancelModalId(null)} centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5 text-danger">Cancel Booking Request</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-3">
            <p className="text-muted mb-0">
              Are you sure you want to cancel this booking? This action cannot be reversed.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={() => setCancelModalId(null)}>
              Keep Booking
            </Button>
            <Button variant="danger" disabled={cancelling} onClick={confirmCancelBooking}>
              {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default CustomerBookings;
