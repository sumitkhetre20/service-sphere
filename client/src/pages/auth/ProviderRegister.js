import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProviderRegister = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        role: 'provider', // Fixed role for provider registration
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        }
      });

      // Redirect to login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Service Sphere</h2>
                <p className="text-muted">Service Provider Registration</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your business name"
                        {...registerForm('name', {
                          required: 'Business name is required',
                          minLength: {
                            value: 2,
                            message: 'Business name must be at least 2 characters'
                          }
                        })}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your business email"
                        {...registerForm('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Create a password"
                        {...registerForm('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        {...registerForm('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        isInvalid={!!errors.confirmPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Business Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your business phone number"
                    {...registerForm('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Business Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your business address"
                    {...registerForm('street', {
                      required: 'Business address is required'
                    })}
                    isInvalid={!!errors.street}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.street?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        {...registerForm('city', {
                          required: 'City is required'
                        })}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="State"
                        {...registerForm('state', {
                          required: 'State is required'
                        })}
                        isInvalid={!!errors.state}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.state?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Pincode"
                        {...registerForm('pincode', {
                          required: 'Pincode is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: 'Please enter a valid 6-digit pincode'
                          }
                        })}
                        isInvalid={!!errors.pincode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.pincode?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Provider Account'
                  )}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none">
                      Login here
                    </Link>
                  </p>
                  <p className="mb-0 mt-2">
                    Are you a customer?{' '}
                    <Link to="/customer/register" className="text-primary text-decoration-none">
                      Register as Customer
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProviderRegister;
