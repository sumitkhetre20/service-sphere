import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

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
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (err) {
      setError('Failed to fetch statistics. Please try again.');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
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
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      {stats && (
        <Row>
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-primary mb-2">
                  {stats.totalUsers}
                </div>
                <Card.Title className="text-muted">Total Users</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-warning mb-2">
                  {stats.totalProviders}
                </div>
                <Card.Title className="text-muted">Total Providers</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-info mb-2">
                  {stats.totalBookings}
                </div>
                <Card.Title className="text-muted">Total Bookings</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <div className="display-4 text-success mb-2">
                  {stats.totalServices}
                </div>
                <Card.Title className="text-muted">Total Services</Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm border-success">
              <Card.Body className="text-center">
                <div className="display-4 text-success mb-2">
                  ₹{stats.totalRevenue?.toLocaleString() || 0}
                </div>
                <Card.Title className="text-muted">Total Revenue</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">
                Use the navigation menu to manage users, services, and bookings.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
