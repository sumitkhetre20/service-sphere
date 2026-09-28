import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaSave, FaStar } from 'react-icons/fa';

const ProviderProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    bio: '',
    experience: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'provider') {
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
      },
      bio: user.profile?.bio || '',
      experience: user.profile?.experience || ''
    });

    setLoading(false);
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
    setError('');
    setSuccess('');

    try {
      if (!profile.name || !profile.phone) {
        setError('Name and phone are required');
        return;
      }

      const profileData = {
        name: profile.name?.trim(),
        phone: profile.phone?.trim(),
        address: profile.address || {},
        profile: {
          bio: profile.bio?.trim() || '',
          experience: profile.experience?.trim() || ''
        }
      };

      const response = await updateProfile(profileData);
      if (response?.data?.success || response?.user) {
        setSuccess('Provider profile updated successfully!');
        toast.success('Profile updated successfully!');
      } else {
        setError(response?.data?.message || 'Profile update completed');
      }
    } catch (err) {
      console.error('UPDATE ERROR:', err);
      const msg = err.response?.data?.message || err.message || 'Profile update failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
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
              <div className="profile-avatar mx-auto mb-3 shadow">
                {getInitials(profile.name)}
              </div>
              <h3 className="fw-bold text-dark mb-1">{profile.name}</h3>
              <p className="text-muted small mb-2">{profile.email}</p>
              <div className="d-flex justify-content-center gap-2">
                <Badge bg="success" className="px-3 py-1 text-uppercase">
                  Verified Provider
                </Badge>
                {user?.profile?.rating ? (
                  <Badge bg="warning" className="text-dark px-3 py-1 d-flex align-items-center gap-1">
                    <FaStar size={11} /> {user.profile.rating} / 5
                  </Badge>
                ) : null}
              </div>
            </Card>

            {/* Profile Form Card */}
            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">Business & Professional Profile</h4>

              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  Basic Business Info
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaBriefcase className="text-muted" size={12} /> Provider / Business Name
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
                        <FaEnvelope className="text-muted" size={12} /> Email (Login ID)
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaPhone className="text-muted" size={12} /> Contact Phone Number
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
                  Qualifications & Bio
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Public Bio / Introduction</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Introduce your team, specialty, and track record to clients..."
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold">Years of Experience & Certifications</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        placeholder="e.g. 8+ years licensed plumbing experience, ISO certified equipment..."
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  Operating Address
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold d-flex align-items-center gap-2">
                        <FaMapMarkerAlt className="text-muted" size={12} /> Street Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="address.street"
                        value={profile.address?.street || ''}
                        onChange={handleChange}
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
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <FaSave size={14} /> Save Profile Changes
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

export default ProviderProfile;
