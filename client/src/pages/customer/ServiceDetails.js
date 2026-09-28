import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../../utils/axiosInterceptor';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/ui/StarRating';
import {
  FaCheckCircle,
  FaShieldAlt,
  FaRegCalendarAlt,
  FaRegClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaArrowLeft,
  FaStar,
  FaComments
} from 'react-icons/fa';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingModalLoading, setBookingModalLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [ratingData, setRatingData] = useState({
    rating: '5',
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
      setError('');
      const response = await api.get(`/services/${id}`);

      if (!response?.data?.success || !response?.data?.data) {
        throw new Error('Service details unavailable');
      }

      setService(response.data.data);
      if (response.data.data.duration) {
        setBookingData(prev => ({ ...prev, duration: response.data.data.duration }));
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError(err.response?.data?.message || 'Service could not be found.');
      setService(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRatings = useCallback(async () => {
    try {
      const response = await api.get(`/ratings/service/${id}`);
      setRatings(response.data.data || []);
    } catch (err) {
      console.error('Error fetching ratings:', err);
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
    if (!isAuthenticated) {
      toast.info('Please sign in to leave a review.');
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    setRatingLoading(true);
    try {
      const response = await api.post('/ratings', {
        service: id,
        rating: Number(ratingData.rating),
        review: ratingData.review
      });

      if (response.data.success) {
        setRatingData({ rating: '5', review: '' });
        fetchRatings();
        fetchService();
        toast.success('Thank you! Your review was submitted successfully.');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
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
      setBookingData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/services/${id}` } });
      return;
    }

    setBookingModalLoading(true);
    try {
      if (!bookingData.scheduledDate || !bookingData.scheduledTime || !bookingData.address.street) {
        throw new Error('Please fill in all required scheduling and address fields.');
      }

      const response = await api.post('/bookings', {
        serviceId: id,
        ...bookingData,
        duration: Number(bookingData.duration)
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Booking request failed');
      }

      setShowBookingModal(false);
      toast.success('Service booked successfully! Check your bookings dashboard.');
      navigate('/customer/bookings');
    } catch (err) {
      console.error('Error booking service:', err);
      const msg = err.response?.data?.message || err.message || 'Unable to place booking.';
      toast.error(msg);
    } finally {
      setBookingModalLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="ss-spinner mx-auto mb-3"></div>
          <p className="text-muted fw-semibold">Loading service details...</p>
        </div>
      </Container>
    );
  }

  if (error || !service) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: '50vh' }}>
        <Alert variant="danger" className="d-inline-block text-start p-4">
          <h4 className="alert-heading">Notice</h4>
          <p>{error || 'Requested service could not be loaded.'}</p>
          <hr />
          <Button as={Link} to="/services" variant="outline-danger" size="sm">
            <FaArrowLeft className="me-2" /> Back to Services
          </Button>
        </Alert>
      </Container>
    );
  }

  const estimatedTotal = (service.price?.basePrice || 0) * (bookingData.duration || 1);

  return (
    <div className="py-4 bg-light" style={{ minHeight: '85vh' }}>
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <Link to="/services" className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2">
            <FaArrowLeft size={12} /> Back to Catalog
          </Link>
          <Badge bg="primary-soft" className="text-primary text-uppercase px-3 py-2">
            {service.category?.replace('-', ' ')}
          </Badge>
        </div>

        <Row className="gy-4">
          {/* Main Left Details */}
          <Col lg={8}>
            {/* Service Banner Image */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <img
                src={
                  service.images?.[0] ||
                  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80'
                }
                alt={service.name}
                className="w-100"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
              />
            </Card>

            {/* Service Overview */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 pb-3 border-bottom mb-4">
                <div>
                  <h1 className="fw-bold fs-3 text-dark mb-2">{service.name}</h1>
                  <div className="d-flex align-items-center gap-3">
                    <StarRating rating={service.rating || 0} totalReviews={service.totalReviews || 0} size={16} />
                    <span className="text-muted">•</span>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <FaRegClock /> Estimated {service.duration || 1} {service.price?.unit || 'hour'}(s)
                    </span>
                  </div>
                </div>
                <div className="text-md-end">
                  <span className="text-muted small d-block">Base Price</span>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="fw-bold fs-2 text-primary">₹{service.price?.basePrice}</span>
                    <span className="text-muted small">/{service.price?.unit || 'service'}</span>
                  </div>
                </div>
              </div>

              <h5 className="fw-bold text-dark mb-3">Service Description</h5>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                {service.description}
              </p>

              {/* Service Highlights / Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mt-3">
                  <h6 className="fw-semibold text-dark small text-uppercase mb-2">Key Tags</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="badge bg-light text-dark border px-3 py-2 fw-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Provider Profile Card */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Service Provider</h5>
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white bg-primary flex-shrink-0"
                  style={{ width: '56px', height: '56px', fontSize: '1.4rem' }}
                >
                  <FaUserTie />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1 text-dark">{service.provider?.name || 'Authorized Professional'}</h6>
                  <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                    <FaCheckCircle className="text-success" /> Verified Service Sphere Professional
                  </div>
                  <p className="text-muted small mb-0">
                    {service.provider?.profile?.bio ||
                      'Certified and background-checked service technician dedicated to high customer satisfaction.'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Ratings and Reviews Section */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <FaComments className="text-primary" /> Customer Reviews ({ratings.length})
                </h5>
                <StarRating rating={service.rating || 0} size={15} />
              </div>

              {/* Leave a Rating Form */}
              <div className="p-3 rounded-3 bg-light mb-4 border">
                <h6 className="fw-bold mb-2">Leave Your Feedback</h6>
                <Form onSubmit={handleRatingSubmit}>
                  <Row className="g-2 mb-2">
                    <Col sm={4}>
                      <Form.Select
                        name="rating"
                        value={ratingData.rating}
                        onChange={handleRatingChange}
                        size="sm"
                        required
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Good)</option>
                        <option value="2">⭐⭐ (2 - Average)</option>
                        <option value="1">⭐ (1 - Needs Improvement)</option>
                      </Form.Select>
                    </Col>
                    <Col sm={8}>
                      <Form.Control
                        type="text"
                        name="review"
                        placeholder="Write a brief comment (optional)..."
                        value={ratingData.review}
                        onChange={handleRatingChange}
                        size="sm"
                      />
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" size="sm" disabled={ratingLoading} className="px-3">
                    {ratingLoading ? 'Submitting...' : 'Post Review'}
                  </Button>
                </Form>
              </div>

              {/* Reviews Feed */}
              {ratings.length === 0 ? (
                <p className="text-muted small text-center my-4">
                  No written reviews yet. Be the first to rate this service!
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {ratings.map((rev, index) => (
                    <div key={index} className="p-3 border rounded-3 bg-white">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-bold text-dark">{rev.customer?.name || 'Verified Customer'}</span>
                          <div className="d-flex align-items-center gap-1 text-warning small">
                            {'⭐'.repeat(rev.rating)}
                          </div>
                        </div>
                        <span className="text-muted small">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      {rev.review && <p className="text-muted small mb-0">{rev.review}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Col>

          {/* Sticky Right Booking Card */}
          <Col lg={4}>
            <Card className="border-0 shadow-lg rounded-4 p-4 sticky-top bg-white" style={{ top: '90px' }}>
              <h5 className="fw-bold text-dark mb-3">Book This Service</h5>

              <div className="p-3 bg-light rounded-3 mb-4">
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Unit Rate</span>
                  <span className="fw-semibold text-dark">₹{service.price?.basePrice}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Standard Duration</span>
                  <span className="fw-semibold text-dark">{service.duration || 1} {service.price?.unit || 'hr'}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-baseline">
                  <span className="fw-bold text-dark">Estimated Total</span>
                  <span className="fw-bold fs-4 text-primary">₹{estimatedTotal}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                  <FaCheckCircle className="text-success" /> Guaranteed high-quality equipment
                </div>
                <div className="d-flex align-items-center gap-2 small text-muted mb-2">
                  <FaShieldAlt className="text-primary" /> Verified & background-checked pro
                </div>
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <FaRegCalendarAlt className="text-warning" /> Flexible rescheduling
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-100 py-3 fw-bold shadow-sm"
                onClick={() => setShowBookingModal(true)}
              >
                Schedule & Book Now
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Booking Form Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <div>
            <Modal.Title className="fw-bold fs-5">Schedule Booking</Modal.Title>
            <p className="text-muted small mb-0">{service.name}</p>
          </div>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body className="pt-3">
            <h6 className="fw-bold small text-uppercase text-muted mb-3">1. Schedule Appointment</h6>
            <Row className="g-3 mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Preferred Date</Form.Label>
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
                <Form.Group>
                  <Form.Label className="small fw-semibold">Preferred Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="scheduledTime"
                    value={bookingData.scheduledTime}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Duration ({service.price?.unit || 'hours'})</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    min="1"
                    value={bookingData.duration}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="fw-bold small text-uppercase text-muted mb-3">2. Service Location</h6>
            <Row className="g-3 mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Street Address / Landmark</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.street"
                    placeholder="House/Flat No., Street, Landmark"
                    value={bookingData.address.street}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    placeholder="City"
                    value={bookingData.address.city}
                    onChange={handleBookingChange}
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
                    placeholder="State"
                    value={bookingData.address.state}
                    onChange={handleBookingChange}
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
                    placeholder="6 digits"
                    value={bookingData.address.pincode}
                    onChange={handleBookingChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <span className="small text-muted d-block">Estimated Cost</span>
                <span className="fw-bold fs-4 text-primary">₹{estimatedTotal}</span>
              </div>
              <span className="text-muted small">Payment collected after service</span>
            </div>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0">
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={bookingModalLoading} className="px-4 fw-bold">
              {bookingModalLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Confirming Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceDetails;
