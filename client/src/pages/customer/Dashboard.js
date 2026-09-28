import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaWallet,
  FaSearch,
  FaPhoneAlt,
  FaCalendarAlt,
  FaRedo
} from 'react-icons/fa';

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

      const response = await api.get('/bookings/customer', { params: { limit: 100 } });
      const bookings = response.data.data || [];

      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalSpent = completedBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalSpent
      });

      setAllBookings(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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
      await fetchDashboardData();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading your customer portal...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-page py-4">
      <Container>
        {/* Welcome Banner */}
        <div className="dashboard-welcome shadow-sm">
          <h2>Welcome back, {user?.name || 'Customer'}! 👋</h2>
          <p>
            Track your home service orders, review schedules, and discover top-rated service pros across your city.
          </p>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* 4 Metric Cards */}
        <Row className="g-3 mb-4">
          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon primary">
                <FaCalendarCheck />
              </div>
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon warning">
                <FaClock />
              </div>
              <div className="stat-number">{stats.pendingBookings}</div>
              <div className="stat-label">Pending Confirmation</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon success">
                <FaCheckCircle />
              </div>
              <div className="stat-number">{stats.completedBookings}</div>
              <div className="stat-label">Completed Services</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon accent">
                <FaWallet />
              </div>
              <div className="stat-number">₹{stats.totalSpent}</div>
              <div className="stat-label">Lifetime Spend</div>
            </div>
          </Col>
        </Row>

        {/* Quick Actions Bar */}
        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold text-dark mb-1">Need to schedule a new service?</h5>
              <p className="text-muted small mb-0">Browse through over 20+ home cleaning, plumbing, electrical, and salon categories.</p>
            </div>
            <div className="d-flex gap-2">
              <Button as={Link} to="/services" variant="primary" className="d-flex align-items-center gap-2 px-4 py-2 fw-semibold">
                <FaSearch size={14} /> Browse Services
              </Button>
              <Button as={Link} to="/customer/bookings" variant="outline-primary" className="px-3 py-2 fw-semibold">
                View All Bookings
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Bookings Feed */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">Recent Appointments</h5>
            <span className="text-muted small">Showing latest bookings</span>
          </div>

          <Card.Body className="p-0">
            {allBookings.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon="📦"
                  title="No bookings recorded"
                  description="You have not scheduled any service appointments yet."
                  actionText="Explore Marketplace"
                  actionLink="/services"
                />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Service & Provider</th>
                      <th>Scheduled Slot</th>
                      <th>Total Cost</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.slice(0, 8).map((booking) => (
                      <tr key={booking._id}>
                        <td className="ps-4 py-3">
                          <strong className="text-dark d-block">{booking.service?.name || 'Home Service'}</strong>
                          <span className="text-muted small d-block">
                            Pro: {booking.provider?.name || 'Verified Pro'}
                          </span>
                          {booking.provider?.phone && (
                            <span className="text-muted small d-inline-flex align-items-center gap-1">
                              <FaPhoneAlt size={10} /> {booking.provider.phone}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="small fw-semibold text-dark">
                            <FaCalendarAlt size={12} className="text-muted me-1" />
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </div>
                          <span className="text-muted small">{booking.scheduledTime}</span>
                        </td>
                        <td>
                          <strong className="text-primary fs-6">₹{booking.totalPrice}</strong>
                        </td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="text-end pe-4">
                          {booking.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={actionLoading === booking._id}
                              className="px-3"
                            >
                              {actionLoading === booking._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                'Cancel'
                              )}
                            </Button>
                          )}
                          {booking.status === 'completed' && booking.service?._id && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => navigate(`/services/${booking.service._id}`)}
                              className="d-inline-flex align-items-center gap-1 px-3"
                            >
                              <FaRedo size={11} /> Rebook
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CustomerDashboard;
