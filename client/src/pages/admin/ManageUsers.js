import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Row, Col } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/approve`);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to approve user. Please try again.');
      console.error('Error approving user:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
      <h1 className="mb-4">Manage Users</h1>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Approved</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'provider' ? 'warning' : 'info'}>
                  {user.role}
                </Badge>
              </td>
              <td>
                <Badge bg={user.isApproved ? 'success' : 'secondary'}>
                  {user.isApproved ? 'Yes' : 'No'}
                </Badge>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  {user.role === 'provider' && !user.isApproved && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleApprove(user._id)}
                      disabled={actionLoading === user._id}
                    >
                      {actionLoading === user._id ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" /> Approving...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    View Details
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {users.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">No users found.</p>
        </div>
      )}

      {/* User Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Name:</strong> {selectedUser.name}
                </Col>
                <Col md={6}>
                  <strong>Role:</strong> 
                  <Badge bg={selectedUser.role === 'admin' ? 'danger' : selectedUser.role === 'provider' ? 'warning' : 'info'}>
                    {selectedUser.role}
                  </Badge>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Email:</strong> {selectedUser.email}
                </Col>
                <Col md={6}>
                  <strong>Phone:</strong> {selectedUser.phone || 'Not provided'}
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Approved:</strong> 
                  <Badge bg={selectedUser.isApproved ? 'success' : 'secondary'}>
                    {selectedUser.isApproved ? 'Yes' : 'No'}
                  </Badge>
                </Col>
                <Col md={6}>
                  <strong>Member Since:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
                </Col>
              </Row>
              
              {selectedUser.address && (
                <div className="mb-3">
                  <strong>Address:</strong><br/>
                  {selectedUser.address.street}, {selectedUser.address.city}, {selectedUser.address.state} - {selectedUser.address.pincode}
                </div>
              )}
              
              {selectedUser.profile && (
                <div className="mb-3">
                  <strong>Profile:</strong><br/>
                  {selectedUser.profile.bio && <p>{selectedUser.profile.bio}</p>}
                  {selectedUser.profile.experience && <p><strong>Experience:</strong> {selectedUser.profile.experience}</p>}
                  {selectedUser.profile.rating && <p><strong>Rating:</strong> {selectedUser.profile.rating} ⭐</p>}
                  {selectedUser.profile.totalReviews && <p><strong>Total Reviews:</strong> {selectedUser.profile.totalReviews}</p>}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
