import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import {
  FaUsers,
  FaUserTie,
  FaCalendarCheck,
  FaTools,
  FaRupeeSign,
  FaArrowRight,
  FaShieldAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (err) {
      setError('Failed to fetch platform statistics. Please try again.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading Admin Analytics...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-page py-4">
      <Container>
        {/* Welcome Header */}
        <div className="dashboard-welcome shadow-sm" style={{ background: 'var(--ss-gradient-hero)' }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <FaShieldAlt size={22} className="text-warning" />
            <h2 className="mb-0">Platform Administration Console</h2>
          </div>
          <p className="text-white-50">
            Welcome back, Administrator <strong>{user?.name}</strong>. Monitor platform-wide metrics, approve pending providers, and audit active transactions.
          </p>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* 5 KPI Metric Cards */}
        {stats && (
          <Row className="g-3 mb-4">
            <Col lg={4} md={6}>
              <div className="stat-card">
                <div className="stat-icon primary">
                  <FaUsers />
                </div>
                <div className="stat-number">{stats.totalUsers}</div>
                <div className="stat-label">Registered Consumers</div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="stat-card">
                <div className="stat-icon warning">
                  <FaUserTie />
                </div>
                <div className="stat-number">{stats.totalProviders}</div>
                <div className="stat-label">Service Providers</div>
              </div>
            </Col>

            <Col lg={4} md={6}>
              <div className="stat-card">
                <div className="stat-icon accent">
                  <FaCalendarCheck />
                </div>
                <div className="stat-number">{stats.totalBookings}</div>
                <div className="stat-label">Total Bookings Recorded</div>
              </div>
            </Col>

            <Col lg={6} md={6}>
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaTools />
                </div>
                <div className="stat-number">{stats.totalServices}</div>
                <div className="stat-label">Active Published Services</div>
              </div>
            </Col>

            <Col lg={6} md={12}>
              <div className="stat-card border-success">
                <div className="stat-icon success">
                  <FaRupeeSign />
                </div>
                <div className="stat-number text-success">
                  ₹{stats.totalRevenue?.toLocaleString() || 0}
                </div>
                <div className="stat-label">Platform Gross Volume (GMV)</div>
              </div>
            </Col>
          </Row>
        )}

        {/* Admin Navigation Quick-Launch */}
        <h5 className="fw-bold text-dark mb-3">Management Consoles</h5>
        <Row className="g-3">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 bg-primary-soft text-primary rounded-3 d-inline-flex mb-3">
                  <FaUsers size={22} />
                </div>
                <h5 className="fw-bold text-dark mb-1">User & Provider Accounts</h5>
                <p className="text-muted small mb-3">
                  Verify new service providers, audit client profiles, and inspect contact records.
                </p>
              </div>
              <Button as={Link} to="/admin/users" variant="outline-primary" className="d-flex align-items-center justify-content-between w-100 fw-semibold">
                <span>Manage Users</span> <FaArrowRight size={12} />
              </Button>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 bg-warning-soft text-warning rounded-3 d-inline-flex mb-3">
                  <FaTools size={22} />
                </div>
                <h5 className="fw-bold text-dark mb-1">Platform Services</h5>
                <p className="text-muted small mb-3">
                  Review listings, enable or deactivate non-compliant services, and monitor standard pricing.
                </p>
              </div>
              <Button as={Link} to="/admin/services" variant="outline-primary" className="d-flex align-items-center justify-content-between w-100 fw-semibold">
                <span>Manage Services</span> <FaArrowRight size={12} />
              </Button>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
              <div>
                <div className="p-3 bg-success-soft text-success rounded-3 d-inline-flex mb-3">
                  <FaCalendarCheck size={22} />
                </div>
                <h5 className="fw-bold text-dark mb-1">Global Bookings</h5>
                <p className="text-muted small mb-3">
                  Supervise all ongoing and completed customer orders, schedule conflicts, and cancellations.
                </p>
              </div>
              <Button as={Link} to="/admin/bookings" variant="outline-primary" className="d-flex align-items-center justify-content-between w-100 fw-semibold">
                <span>Manage Bookings</span> <FaArrowRight size={12} />
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
