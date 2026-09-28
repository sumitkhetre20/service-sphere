import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Row, Col, Card, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { FaEye, FaSearch, FaCheck, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
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
      setError('');
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
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
      toast.success('Provider account successfully approved!');
      await fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to approve user.';
      setError(msg);
      toast.error(msg);
      console.error('Error approving user:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (targetUser) => {
    setSelectedUser(targetUser);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery);
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

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
            <h2 className="fw-bold text-dark mb-1">User & Provider Directory</h2>
            <p className="text-muted small mb-0">Audit registered members, evaluate verification states, and authorize service providers.</p>
          </div>
          <Badge bg="primary" className="px-3 py-2 fs-6 rounded-pill">
            {users.length} Total Registered
          </Badge>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        {/* Filter & Search Bar */}
        <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={13} />
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '38px' }}
                  size="sm"
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                size="sm"
              >
                <option value="">All Roles</option>
                <option value="customer">Customers</option>
                <option value="provider">Service Providers</option>
                <option value="admin">Administrators</option>
              </Form.Select>
            </Col>
            <Col md={2} className="text-end">
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100"
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('');
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Users Table Card */}
        <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
          <Card.Body className="p-0">
            {filteredUsers.length === 0 ? (
              <div className="p-5 text-center text-muted">
                <p className="mb-0">No user accounts found matching your query.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">User</th>
                      <th>Role</th>
                      <th>Approval Status</th>
                      <th>Phone</th>
                      <th>Registered On</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4 py-3">
                          <strong className="text-dark d-block">{u.name}</strong>
                          <span className="text-muted small">{u.email}</span>
                        </td>
                        <td>
                          <Badge
                            bg={u.role === 'admin' ? 'danger' : u.role === 'provider' ? 'warning' : 'info'}
                            className="text-uppercase"
                            style={{ fontSize: '0.72rem' }}
                          >
                            {u.role}
                          </Badge>
                        </td>
                        <td>
                          {u.isApproved ? (
                            <span className="badge bg-success-soft text-success px-2 py-1 small fw-semibold">
                              Approved
                            </span>
                          ) : (
                            <span className="badge bg-warning-soft text-warning px-2 py-1 small fw-semibold">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="small text-muted">{u.phone || 'N/A'}</td>
                        <td className="small text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            {u.role === 'provider' && !u.isApproved && (
                              <Button
                                variant="success"
                                size="sm"
                                className="d-inline-flex align-items-center gap-1 px-3 fw-semibold"
                                onClick={() => handleApprove(u._id)}
                                disabled={actionLoading === u._id}
                              >
                                {actionLoading === u._id ? (
                                  <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                  <>
                                    <FaCheck size={11} /> Approve
                                  </>
                                )}
                              </Button>
                            )}

                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="d-inline-flex align-items-center gap-1 px-3"
                              onClick={() => handleViewDetails(u)}
                            >
                              <FaEye size={12} /> View
                            </Button>
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

        {/* User Details Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold fs-5">Account Particulars</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-3">
            {selectedUser && (
              <div>
                <div className="p-3 bg-light rounded-3 mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold text-dark mb-1">{selectedUser.name}</h5>
                    <span className="text-muted small">{selectedUser.email}</span>
                  </div>
                  <Badge
                    bg={selectedUser.role === 'admin' ? 'danger' : selectedUser.role === 'provider' ? 'warning' : 'info'}
                    className="text-uppercase px-3 py-2"
                  >
                    {selectedUser.role}
                  </Badge>
                </div>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Contact Details</h6>
                      <div className="d-flex align-items-center gap-2 text-dark small mb-1">
                        <FaPhoneAlt size={12} className="text-primary" /> {selectedUser.phone || 'None provided'}
                      </div>
                      <div className="d-flex align-items-center gap-2 text-dark small">
                        <FaEnvelope size={12} className="text-primary" /> {selectedUser.email}
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Registered Address</h6>
                      <div className="d-flex align-items-start gap-2 text-dark small">
                        <FaMapMarkerAlt size={12} className="text-danger mt-1 flex-shrink-0" />
                        <span>
                          {selectedUser.address?.street
                            ? `${selectedUser.address.street}, ${selectedUser.address.city}, ${selectedUser.address.state} - ${selectedUser.address.pincode}`
                            : 'No address submitted'}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>

                {selectedUser.profile && (
                  <div className="p-3 bg-light rounded-3 mb-3">
                    <h6 className="fw-bold text-dark small text-uppercase mb-2">Professional Profile</h6>
                    {selectedUser.profile.bio && (
                      <p className="small text-secondary mb-2">
                        <strong>Bio:</strong> {selectedUser.profile.bio}
                      </p>
                    )}
                    {selectedUser.profile.experience && (
                      <p className="small text-secondary mb-2">
                        <strong>Experience:</strong> {selectedUser.profile.experience}
                      </p>
                    )}
                    {typeof selectedUser.profile.rating !== 'undefined' && (
                      <span className="badge bg-warning text-dark me-2">
                        ⭐ {selectedUser.profile.rating} / 5
                      </span>
                    )}
                    {typeof selectedUser.profile.totalReviews !== 'undefined' && (
                      <span className="text-muted small">
                        ({selectedUser.profile.totalReviews} total reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ManageUsers;
