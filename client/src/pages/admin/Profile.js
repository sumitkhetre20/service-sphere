import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Spinner, Row, Col, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserShield, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaSave } from 'react-icons/fa';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [localLoading, setLocalLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    });

    setLocalLoading(false);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile(profile);
      toast.success('Admin profile credentials updated successfully!');
    } catch (error) {
      toast.error('Failed to update admin profile');
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (localLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="ss-spinner"></div>
      </Container>
    );
  }

  return (
    <div className="py-5 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            {/* Header Badge Card */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 text-center p-4 bg-white">
              <div
                className="profile-avatar mx-auto mb-3 shadow"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
              >
                {getInitials(profile.name)}
              </div>
              <h3 className="fw-bold text-dark mb-1">{profile.name}</h3>
              <p className="text-muted small mb-2">{profile.email}</p>
              <div>
                <Badge bg="danger" className="px-3 py-1 text-uppercase">
                  Root Administrator
                </Badge>
              </div>
            </Card>

            {/* Profile Form Card */}
            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">System Administrator Profile</h4>

              <Form onSubmit={handleSubmit}>
                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  Account Details
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaUserShield className="text-muted" size={12} /> Administrator Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaEnvelope className="text-muted" size={12} /> System Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        disabled
                        className="bg-light"
                      />
                      <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaPhone className="text-muted" size={12} /> Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  HQ / Postal Address
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaMapMarkerAlt className="text-muted" size={12} /> Office / Street
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={profile.address?.street || ''}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaCity className="text-muted" size={12} /> City
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.city"
                        value={profile.address?.city || ''}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">State</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.state"
                        value={profile.address?.state || ''}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        name="address.pincode"
                        value={profile.address?.pincode || ''}
                        onChange={handleChange}
                        pattern="\d{6}"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end pt-3 border-top">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updating}
                    className="px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 shadow-sm"
                  >
                    {updating ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Updating Admin...
                      </>
                    ) : (
                      <>
                        <FaSave size={14} /> Update Credentials
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminProfile;
