import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingModalLoading, setBookingModalLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingData, setRatingData] = useState({
    rating: '',
    review: ''
  });
  const [ratingLoading, setRatingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    duration: 1,
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const fetchService = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/services/${id}`);
      
      if (!response?.data?.success || !response?.data?.data) {
        throw new Error('Service not found');
      }
      
      setService(response.data.data);
    } catch (error) {
      setError('Failed to fetch service details');
      console.error('Error fetching service:', error);
      setService(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRatings = useCallback(async () => {
    try {
      const response = await api.get(`/ratings/service/${id}`);
      setRatings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchService();
    fetchRatings();
  }, [id, fetchService, fetchRatings]);

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingLoading(true);
    
    try {
      const response = await api.post('/ratings', {
        service: id,
        rating: ratingData.rating,
        review: ratingData.review
      });
      
      if (response.data.success) {
        setRatingData({ rating: '', review: '' });
        fetchRatings();
        alert('Rating submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      // Handle regular fields
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingModalLoading(true);
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    try {
      // Validate booking data before sending
      if (!bookingData.scheduledDate || !bookingData.scheduledTime || !bookingData.address.street) {
        throw new Error('Please fill all required fields');
      }

      console.log('Submitting booking:', { serviceId: id, ...bookingData });
      const response = await api.post('/bookings', {
        serviceId: id,
        ...bookingData
      });
      
      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Booking failed');
      }
      
      console.log('Booking response:', response.data);
      
      setShowBookingModal(false);
      alert('Booking created successfully!');
      setBookingData({
        scheduledDate: '',
        scheduledTime: '',
        duration: 1,
        address: {
          street: '',
          city: '',
          state: '',
          pincode: ''
        }
      });
    } catch (error) {
      console.error('Error booking service:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to book service. Please try again.';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = 'Validation errors:\n' + error.response.data.errors.map(err => err.msg).join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setBookingModalLoading(false);
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

  if (error || !service) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error || 'Service not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          {/* Service Images */}
          {service.images && service.images.length > 0 && (
            <Card className="mb-4">
              <Card.Img 
                src={service.images[0]} 
                style={{ height: '400px', objectFit: 'cover' }}
              />
            </Card>
          )}

          {/* Service Details */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2>{service?.name || 'Service Name'}</h2>
                  <Badge bg="secondary" className="mb-2">{service?.category || 'Category'}</Badge>
                </div>
                <div className="text-end">
                  <h3 className="text-primary mb-0">₹{service?.price?.basePrice || 0}</h3>
                  <small className="text-muted">per {service?.price?.unit || 'unit'}</small>
                </div>
              </div>
              <p className="text-muted small">
                {service?.provider?.profile?.bio || 'Professional service provider'}
              </p>
            </Card.Body>
          </Card>

          {/* Rating Section */}
          <Card className="mb-4">
            <Card.Body>
              <h5>Rate This Service</h5>
              <p>Share your experience with this service</p>
              
              <Form onSubmit={handleRatingSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating (1-5)</Form.Label>
                      <Form.Select
                        name="rating"
                        value={ratingData.rating}
                        onChange={handleRatingChange}
                        required
                      >
                        <option value="">Select Rating</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="3">⭐⭐⭐ Good</option>
                        <option value="2">⭐⭐ Fair</option>
                        <option value="1">⭐ Poor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Review (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="review"
                        value={ratingData.review}
                        onChange={handleRatingChange}
                        placeholder="Share your experience with this service..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={ratingLoading}
                  className="w-100"
                >
                  {ratingLoading ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </Form>

              {/* Display existing ratings */}
              {ratings && ratings.length > 0 && (
                <div className="mt-4">
                  <h6>Customer Reviews</h6>
                  {ratings.map((rating, index) => (
                    <div key={index} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>{rating.customer?.name}</strong>
                          <div className="text-warning">
                            {'⭐'.repeat(rating.rating)}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      {rating.review && (
                        <p className="mt-2 mb-0">{rating.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Booking Card */}
          <Card>
            <Card.Body>
              <h5>Book This Service</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Base Price:</span>
                  <strong>₹{service?.price?.basePrice || 0}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Duration:</span>
                  <strong>{service?.duration || 1} {service?.price?.unit || 'hour'}(s)</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Estimated Total:</span>
                  <strong className="text-primary">
                    ₹{(service?.price?.basePrice || 0) * (service?.duration || 1)}
                  </strong>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={() => setShowBookingModal(true)}
              >
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Service: {service.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduled Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="scheduledTime"
                    value={bookingData.scheduledTime}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={bookingData.duration}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    value={bookingData.address.street}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={bookingData.address.city}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={bookingData.address.state}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.pincode"
                    value={bookingData.address.pincode}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={bookingModalLoading}
              className="w-100"
            >
              {bookingModalLoading ? 'Booking...' : 'Book Now'}
            </Button>
          </Modal.Body>
        </Form>
      </Modal>
    </Container>
  );
};

export default ServiceDetails;
