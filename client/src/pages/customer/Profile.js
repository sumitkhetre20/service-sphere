import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';


const CustomerProfile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [message, setMessage] = useState('');
  
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
      name: user.name,
      phone: user.phone,
      street: user.address?.street || '',
      city: user.address?.city || '',
      state: user.address?.state || '',
      pincode: user.address?.pincode || ''
    });
  }
}, [user, reset]);


  const onSubmit = useCallback(async (data) => {
    try {
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
      reset({
        name: response.data.user.name,
        phone: response.data.user.phone,
        street: response.data.user.address?.street || '',
        city: response.data.user.address?.city || '',
        state: response.data.user.address?.state || '',
        pincode: response.data.user.address?.pincode || ''
      });
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Failed to update profile');
    }
  }, [updateProfile, reset]);

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">My Profile</h2>
              
              {message && (
                <Alert variant="success">
                  {message}
                </Alert>
              )}

              <Form onSubmit={formHandleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
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
                        value={user?.email}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email cannot be changed
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: '^[0-9]{10}$',
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <h5 className="mt-4 mb-3">Address Information</h5>

                <Form.Group className="mb-3">
                  <Form.Label>Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('street', {
                      required: 'Street address is required'
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
                        {...register('city', {
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
                        {...register('state', {
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
                        {...register('pincode', {
                          required: 'Pincode is required',
                          pattern: {
                            value: '^[0-9]{6}$',
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

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerProfile;
