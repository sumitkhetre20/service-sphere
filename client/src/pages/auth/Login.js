import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCompass, FaCheckCircle } from 'react-icons/fa';

const Login = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = useCallback(async (data) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password);
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [login]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Checking authorization...</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-5" style={{ minHeight: '85vh', background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)' }}>
      <Container>
        <Row className="justify-content-center align-items-center g-0 shadow-lg rounded-4 overflow-hidden bg-white mx-auto" style={{ maxWidth: '980px' }}>
          {/* Left Hero Sidebar */}
          <Col lg={5} className="d-none d-lg-flex flex-column justify-content-between p-5 text-white position-relative" style={{ background: 'var(--ss-gradient-hero)', minHeight: '560px' }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
                  }}
                >
                  <FaCompass size={22} />
                </div>
                <span className="fw-bolder fs-4 text-white">ServiceSphere</span>
              </div>
              <h2 className="fw-bold mb-3">Welcome to your trusted service hub.</h2>
              <p className="text-white-50">
                Book verified professionals or manage your service requests with transparent pricing and real-time updates.
              </p>
            </div>

            <div className="border-top border-white border-opacity-10 pt-4">
              <div className="d-flex align-items-center gap-2 mb-2 text-white-50 small">
                <FaCheckCircle className="text-success" /> 10,000+ Verified Service Experts
              </div>
              <div className="d-flex align-items-center gap-2 mb-2 text-white-50 small">
                <FaCheckCircle className="text-success" /> Secure Booking & Protection
              </div>
              <div className="d-flex align-items-center gap-2 text-white-50 small">
                <FaCheckCircle className="text-success" /> 24/7 Dedicated Support
              </div>
            </div>
          </Col>

          {/* Right Form Card */}
          <Col lg={7} className="p-4 p-md-5">
            <div className="mb-4">
              <span className="badge bg-primary-soft text-primary mb-2 px-3 py-1">Account Access</span>
              <h3 className="fw-bold text-dark">Sign In to Service Sphere</h3>
              <p className="text-muted small">Enter your credentials below to access your dashboard</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4 d-flex align-items-center gap-2 py-2">
                <span>{error}</span>
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaEnvelope className="text-muted" size={13} /> Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="d-flex align-items-center gap-2">
                  <FaLock className="text-muted" size={13} /> Password
                </Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    isInvalid={!!errors.password}
                    style={{ paddingRight: '42px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none pe-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 py-2 fw-bold mb-4 shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Form>

            <div className="border-top pt-4 text-center">
              <p className="text-muted small mb-2">Don't have an account yet?</p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/customer/register" className="btn btn-outline-primary btn-sm px-3 fw-semibold">
                  Register as Customer
                </Link>
                <Link to="/provider/register" className="btn btn-outline-secondary btn-sm px-3 fw-semibold">
                  Join as Provider
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
