import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaBriefcase,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaCompass,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from 'react-icons/fa';

const ProviderRegister = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');

      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'provider',
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        }
      });

      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Checking authentication...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-5" style={{ minHeight: '85vh', background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="p-4 p-md-5 text-white" style={{ background: 'var(--ss-gradient-hero)' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    }}
                  >
                    <FaCompass size={18} />
                  </div>
                  <span className="fw-bolder fs-5">ServiceSphere</span>
                </div>
                <h2 className="fw-bold mb-1">Become a Service Provider</h2>
                <p className="text-white-50 mb-0">Expand your client base, list your services, and receive bookings seamlessly.</p>
              </div>

              <div className="bg-light px-4 px-md-5 py-3 border-bottom d-flex flex-wrap gap-4 text-muted small">
                <span className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" /> Verified Profile Badge
                </span>
                <span className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" /> Direct Customer Bookings
                </span>
                <span className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" /> Fast Admin Approval
                </span>
              </div>

              <Card.Body className="p-4 p-md-5 bg-white">
                {error && (
                  <Alert variant="danger" className="mb-4 d-flex align-items-center gap-2">
                    <span>{error}</span>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                    1. Professional Identity
                  </h6>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaBriefcase className="text-muted" size={12} /> Business / Provider Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="e.g. Apex Electrical Services"
                          {...registerForm('name', {
                            required: 'Business or provider name is required',
                            minLength: { value: 2, message: 'Minimum 2 characters' },
                            maxLength: { value: 50, message: 'Maximum 50 characters' }
                          })}
                          maxLength={50}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaEnvelope className="text-muted" size={12} /> Business Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="pro@business.com"
                          {...registerForm('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
                          })}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaLock className="text-muted" size={12} /> Password
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            {...registerForm('password', {
                              required: 'Password is required',
                              minLength: { value: 6, message: 'Minimum 6 characters' }
                            })}
                            isInvalid={!!errors.password}
                          />
                          <button
                            type="button"
                            className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none pe-3"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                          >
                            {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                          </button>
                        </div>
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaLock className="text-muted" size={12} /> Confirm Password
                        </Form.Label>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Repeat password"
                          {...registerForm('confirmPassword', {
                            required: 'Please confirm password',
                            validate: val => val === password || 'Passwords do not match'
                          })}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                    2. Service Location & Phone
                  </h6>
                  <Row className="g-3 mb-4">
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaPhone className="text-muted" size={12} /> Contact / Dispatch Phone
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="10-digit primary contact number"
                          {...registerForm('phone', {
                            required: 'Phone number is required',
                            pattern: { value: /^\d{10}$/, message: 'Must be exact 10 digits' }
                          })}
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaMapMarkerAlt className="text-muted" size={12} /> Office / Workshop Address
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Shop/Office No., Commercial Complex, Street"
                          {...registerForm('street', { required: 'Street address is required' })}
                          isInvalid={!!errors.street}
                        />
                        <Form.Control.Feedback type="invalid">{errors.street?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                          <FaCity className="text-muted" size={12} /> City
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Operational City"
                          {...registerForm('city', { required: 'City is required' })}
                          isInvalid={!!errors.city}
                        />
                        <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">State</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="State"
                          {...registerForm('state', { required: 'State is required' })}
                          isInvalid={!!errors.state}
                        />
                        <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Pincode</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="6-digit PIN"
                          {...registerForm('pincode', {
                            required: 'Pincode is required',
                            pattern: { value: /^\d{6}$/, message: 'Must be 6 digits' }
                          })}
                          isInvalid={!!errors.pincode}
                        />
                        <Form.Control.Feedback type="invalid">{errors.pincode?.message}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 py-3 fw-bold shadow-sm mb-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Submitting Provider Application...
                      </>
                    ) : (
                      'Register as Service Provider'
                    )}
                  </Button>

                  <div className="text-center border-top pt-4">
                    <span className="text-muted small">Already registered? </span>
                    <Link to="/login" className="text-primary fw-semibold small text-decoration-none">
                      Sign in to Provider Suite
                    </Link>
                    <div className="mt-2">
                      <span className="text-muted small">Looking to book services? </span>
                      <Link to="/customer/register" className="text-primary fw-semibold small text-decoration-none">
                        Register as Customer
                      </Link>
                    </div>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProviderRegister;
