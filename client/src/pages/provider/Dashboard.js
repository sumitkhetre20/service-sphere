import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import {
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaRupeeSign,
  FaTools,
  FaPlus,
  FaUserCheck,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPlay,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

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

      const response = await api.get('/bookings/provider', { params: { limit: 100 } });
      const bookings = response.data.bookings || response.data.data || [];

      const completedBookings = bookings.filter(b => b.status === 'completed');
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        completedBookings: completedBookings.length,
        totalEarnings
      });

      setAllBookings(bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load provider dispatch requests.');
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
      setSuccess(`Booking marked as ${action}!`);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error updating booking:', err);
      setError(err.response?.data?.message || `Failed to ${action} booking.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading Provider Operations...</p>
        </div>
      </Container>
    );
  }

  const activeBookings = allBookings.filter(
    b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in-progress'
  );

  return (
    <div className="dashboard-page py-4">
      <Container>
        {/* Welcome Header */}
        <div className="dashboard-welcome shadow-sm">
          <h2>Provider Operations Suite</h2>
          <p>
            Welcome, <strong>{user?.name}</strong>. Manage incoming customer requests, schedule dispatchers, and track job earnings.
          </p>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        {/* KPI Cards */}
        <Row className="g-3 mb-4">
          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon primary">
                <FaCalendarCheck />
              </div>
              <div className="stat-number">{stats.totalBookings}</div>
              <div className="stat-label">Total Assigned Jobs</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon warning">
                <FaClock />
              </div>
              <div className="stat-number">{stats.pendingBookings}</div>
              <div className="stat-label">Action Required (Pending)</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon success">
                <FaCheckCircle />
              </div>
              <div className="stat-number">{stats.completedBookings}</div>
              <div className="stat-label">Completed Deliveries</div>
            </div>
          </Col>

          <Col md={3} sm={6}>
            <div className="stat-card">
              <div className="stat-icon accent">
                <FaRupeeSign />
              </div>
              <div className="stat-number">₹{stats.totalEarnings}</div>
              <div className="stat-label">Gross Revenue</div>
            </div>
          </Col>
        </Row>

        {/* Quick Access Toolbar */}
        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold text-dark mb-1">Catalog & Service Management</h5>
              <p className="text-muted small mb-0">Publish new services or update pricing, durations, and weekly availability.</p>
            </div>
            <div className="d-flex gap-2">
              <Button as={Link} to="/provider/add-service" variant="primary" className="d-flex align-items-center gap-2 px-3 fw-semibold">
                <FaPlus size={12} /> Add New Service
              </Button>
              <Button as={Link} to="/provider/services" variant="outline-primary" className="d-flex align-items-center gap-2 px-3 fw-semibold">
                <FaTools size={12} /> My Catalog
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Active Bookings Queue */}
        <Card className="border-0 shadow-sm rounded-4 bg-white mb-4 overflow-hidden">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold text-dark mb-1">Active Booking Queue</h5>
              <span className="text-muted small">
                {activeBookings.length} customer request(s) require action or execution
              </span>
            </div>
            <Badge bg="primary" className="px-3 py-2 rounded-pill">
              {activeBookings.length} Active
            </Badge>
          </div>

          <Card.Body className="p-4">
            {activeBookings.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <p className="mb-0">No pending or ongoing jobs right now. You are all caught up!</p>
              </div>
            ) : (
              <Row className="g-3">
                {activeBookings.map((booking) => (
                  <Col lg={6} key={booking._id}>
                    <div className="p-4 rounded-4 border bg-light h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="fw-bold text-dark mb-1">{booking.service?.name}</h5>
                            <span className="text-muted small">Job #{booking._id.slice(-6).toUpperCase()}</span>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="bg-white p-3 rounded-3 mb-3 border small">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <FaUserCheck className="text-primary" />
                            <strong>{booking.customer?.name || 'Customer'}</strong>
                          </div>
                          {booking.customer?.phone && (
                            <div className="d-flex align-items-center gap-2 text-muted mb-1">
                              <FaPhoneAlt size={11} /> {booking.customer.phone}
                            </div>
                          )}
                          {booking.customer?.email && (
                            <div className="d-flex align-items-center gap-2 text-muted mb-1">
                              <FaEnvelope size={11} /> {booking.customer.email}
                            </div>
                          )}
                          <div className="d-flex align-items-start gap-2 text-muted">
                            <FaMapMarkerAlt size={12} className="mt-1 flex-shrink-0" />
                            <span>
                              {booking.address?.street}, {booking.address?.city}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                          <span>
                            Date: <strong>{new Date(booking.scheduledDate).toLocaleDateString()}</strong> at <strong>{booking.scheduledTime}</strong>
                          </span>
                          <span className="fw-bold fs-6 text-success">₹{booking.totalPrice}</span>
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="pt-3 border-top d-flex gap-2 justify-content-end">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              className="d-flex align-items-center gap-1 px-3 fw-semibold"
                              onClick={() => handleBookingAction(booking._id, 'confirmed')}
                              disabled={actionLoading === booking._id}
                            >
                              {actionLoading === booking._id ? (
                                <Spinner as="span" animation="border" size="sm" />
                              ) : (
                                <>
                                  <FaCheck size={12} /> Accept Job
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="d-flex align-items-center gap-1 px-3 fw-semibold"
                              onClick={() => handleBookingAction(booking._id, 'rejected')}
                              disabled={actionLoading === booking._id}
                            >
                              <FaTimes size={12} /> Reject
                            </Button>
                          </>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            className="d-flex align-items-center gap-1 px-3 fw-semibold"
                            onClick={() => handleBookingAction(booking._id, 'in-progress')}
                            disabled={actionLoading === booking._id}
                          >
                            <FaPlay size={11} /> Mark In-Progress / Start
                          </Button>
                        )}

                        {booking.status === 'in-progress' && (
                          <Button
                            variant="success"
                            size="sm"
                            className="d-flex align-items-center gap-1 px-3 fw-semibold"
                            onClick={() => handleBookingAction(booking._id, 'completed')}
                            disabled={actionLoading === booking._id}
                          >
                            <FaCheckCircle size={12} /> Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>

        {/* All Bookings Archive */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">Job Dispatch Archive</h5>
            <Link to="/provider/bookings" className="btn btn-outline-primary btn-sm px-3">
              Full Bookings Manager
            </Link>
          </div>
          <Card.Body className="p-0">
            {allBookings.length === 0 ? (
              <div className="p-4 text-center text-muted">
                <p className="mb-0">No booking records found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Service</th>
                      <th>Customer</th>
                      <th>Scheduled Slot</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Current Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookings.slice(0, 10).map((booking) => (
                      <tr key={booking._id}>
                        <td className="ps-4 py-3">
                          <strong className="text-dark d-block">{booking.service?.name || 'Service'}</strong>
                          <span className="text-muted small">#{booking._id.slice(-6).toUpperCase()}</span>
                        </td>
                        <td>
                          <span className="fw-semibold text-dark d-block">{booking.customer?.name}</span>
                          <span className="text-muted small">{booking.customer?.phone}</span>
                        </td>
                        <td>
                          <span className="small d-block text-dark">
                            {new Date(booking.scheduledDate).toLocaleDateString()}
                          </span>
                          <span className="text-muted small">{booking.scheduledTime}</span>
                        </td>
                        <td>
                          <strong className="text-success">₹{booking.totalPrice}</strong>
                        </td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="text-end pe-4">
                          <span className="text-muted small text-capitalize">
                            {booking.status === 'completed' ? 'Delivered' : booking.status}
                          </span>
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

export default ProviderDashboard;
