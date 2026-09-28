import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaSave } from 'react-icons/fa';

const CustomerProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit: formHandleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || ''
      });
    }
  }, [user, reset]);

  const onSubmit = useCallback(async (data) => {
    try {
      setSubmitting(true);
      setMessage('');
      const response = await updateProfile({
        name: data.name,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        }
      });

      setMessage('Profile updated successfully!');
      toast.success('Your profile changes have been saved.');

      if (response?.data?.user) {
        reset({
          name: response.data.user.name,
          phone: response.data.user.phone,
          street: response.data.user.address?.street || '',
          city: response.data.user.address?.city || '',
          state: response.data.user.address?.state || '',
          pincode: response.data.user.address?.pincode || ''
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Failed to update profile');
      toast.error('Unable to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [updateProfile, reset]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="py-5 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            {/* Profile Header Card */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 text-center p-4 bg-white">
              <div className="profile-avatar mx-auto mb-3 shadow">
                {getInitials(user?.name)}
              </div>
              <h3 className="fw-bold text-dark mb-1">{user?.name}</h3>
              <p className="text-muted small mb-2">{user?.email}</p>
              <div>
                <Badge bg="primary-soft" className="text-primary text-uppercase px-3 py-1">
                  Customer Account
                </Badge>
              </div>
            </Card>

            {/* Profile Form Card */}
            <Card className="border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">Personal & Address Details</h4>

              {message && (
                <Alert variant="success" className="mb-4">
                  {message}
                </Alert>
              )}

              <Form onSubmit={formHandleSubmit(onSubmit)}>
                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  Account Information
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                        <FaUser className="text-muted" size={12} /> Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: { value: 2, message: 'Minimum 2 characters' }
                        })}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                        <FaEnvelope className="text-muted" size={12} /> Email (Registered)
                      </Form.Label>
                      <Form.Control type="email" value={user?.email || ''} disabled className="bg-light" />
                      <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Email cannot be modified
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                        <FaPhone className="text-muted" size={12} /> Mobile Phone Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^\d{10}$/,
                            message: 'Please enter a valid 10-digit phone number'
                          }
                        })}
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 className="text-uppercase tracking-wider text-muted fw-bold small mb-3">
                  Saved Service Address
                </h6>
                <Row className="g-3 mb-4">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center gap-2 small fw-semibold">
                        <FaMapMarkerAlt className="text-muted" size={12} /> Street Address
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="House No, Apartment, Street"
                        {...register('street', { required: 'Street address is required' })}
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
                        {...register('city', { required: 'City is required' })}
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
                        {...register('state', { required: 'State is required' })}
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
                        {...register('pincode', {
                          required: 'Pincode is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: 'Must be 6 digits'
                          }
                        })}
                        isInvalid={!!errors.pincode}
                      />
                      <Form.Control.Feedback type="invalid">{errors.pincode?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end pt-3 border-top">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting || loading}
                    className="px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FaSave size={14} /> Update Profile
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

export default CustomerProfile;
