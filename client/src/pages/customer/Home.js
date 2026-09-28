import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import {
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaArrowRight,
  FaBroom,
  FaWrench,
  FaBolt,
  FaHammer,
  FaPaintRoller,
  FaSpa,
  FaDumbbell,
  FaGraduationCap
} from 'react-icons/fa';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const featuredServices = [
    {
      id: 1,
      name: 'Deep Home Cleaning',
      category: 'home-cleaning',
      description: 'Comprehensive sanitization and room-by-room deep cleaning by verified professionals.',
      price: 599,
      unit: 'service',
      rating: 4.9,
      reviews: 142,
      badge: 'Popular',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'Expert Plumbing Repairs',
      category: 'plumbing',
      description: 'Rapid resolution for pipe leaks, fixture installations, and bathroom drain blockages.',
      price: 499,
      unit: 'visit',
      rating: 4.8,
      reviews: 98,
      badge: 'Fast Response',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Electrical Inspection & Fixes',
      category: 'electrical',
      description: 'Certified electricians for short circuits, rewiring, appliance repairs, and panel setup.',
      price: 399,
      unit: 'hour',
      rating: 4.9,
      reviews: 215,
      badge: 'Certified',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Salon & Spa at Home',
      category: 'beauty',
      description: 'Luxury salon grooming, facials, waxing, and hair treatments in the comfort of your home.',
      price: 899,
      unit: 'package',
      rating: 5.0,
      reviews: 320,
      badge: 'Top Rated',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const categories = [
    { name: 'Home Cleaning', value: 'home-cleaning', icon: FaBroom, color: '#3b82f6', count: '120+ Pros' },
    { name: 'Plumbing', value: 'plumbing', icon: FaWrench, color: '#06b6d4', count: '85+ Pros' },
    { name: 'Electrical', value: 'electrical', icon: FaBolt, color: '#f59e0b', count: '94+ Pros' },
    { name: 'Carpentry', value: 'carpentry', icon: FaHammer, color: '#8b5cf6', count: '60+ Pros' },
    { name: 'Painting', value: 'painting', icon: FaPaintRoller, color: '#ec4899', count: '45+ Pros' },
    { name: 'Beauty & Spa', value: 'beauty', icon: FaSpa, color: '#10b981', count: '110+ Pros' },
    { name: 'Fitness & Yoga', value: 'fitness', icon: FaDumbbell, color: '#ef4444', count: '35+ Pros' },
    { name: 'Home Tutoring', value: 'tutoring', icon: FaGraduationCap, color: '#6366f1', count: '70+ Pros' }
  ];

  return (
    <>
      {/* Modern Hero Section */}
      <section className="home-hero text-white py-5 position-relative">
        <Container className="home-hero-content py-lg-5">
          <Row className="align-items-center gy-5">
            <Col lg={7}>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 text-white mb-3 border border-white border-opacity-20">
                <span className="badge bg-success rounded-pill px-2 py-1">New</span>
                <span className="small fw-semibold">On-Demand Home Services at Flat Upfront Rates</span>
              </div>
              <h1 className="display-4 fw-black mb-3 lh-sm text-white">
                Reliable home services, <br />
                <span className="text-warning">booked in minutes.</span>
              </h1>
              <p className="lead text-white-50 mb-4 pe-lg-4" style={{ fontSize: '1.15rem' }}>
                Service Sphere connects you with background-checked local professionals for house cleaning, electrical, plumbing, beauty, and maintenance.
              </p>

              {isAuthenticated ? (
                <div className="bg-white bg-opacity-10 p-4 rounded-4 border border-white border-opacity-10 mb-4 backdrop-blur">
                  <h5 className="text-white mb-2 fw-bold">Welcome back, {user?.name}!</h5>
                  <p className="small text-white-50 mb-3">Ready to schedule your next service or track active jobs?</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button as={Link} to="/services" variant="light" size="lg" className="px-4 fw-bold">
                      Browse Services
                    </Button>
                    {user?.role === 'customer' && (
                      <Button as={Link} to="/customer/bookings" variant="outline-light" size="lg" className="px-4">
                        My Bookings
                      </Button>
                    )}
                    {user?.role === 'provider' && (
                      <Button as={Link} to="/provider/services" variant="outline-light" size="lg" className="px-4">
                        Provider Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-3 mb-5">
                  <Button as={Link} to="/services" variant="light" size="lg" className="px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow">
                    Find Services <FaArrowRight size={14} />
                  </Button>
                  <Button as={Link} to="/provider/register" variant="outline-light" size="lg" className="px-4 py-3 fw-semibold">
                    Join as Professional
                  </Button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="row g-3 pt-3 border-top border-white border-opacity-10">
                <div className="col-4">
                  <div className="fw-bold fs-4 text-white">100%</div>
                  <div className="small text-white-50">Verified Pros</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-4 text-white">4.9 / 5</div>
                  <div className="small text-white-50">Customer Rating</div>
                </div>
                <div className="col-4">
                  <div className="fw-bold fs-4 text-white">30k+</div>
                  <div className="small text-white-50">Jobs Finished</div>
                </div>
              </div>
            </Col>

            <Col lg={5} className="d-none d-lg-block text-center">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=650&q=80"
                  alt="Professional Service"
                  className="img-fluid rounded-4 shadow-2xl border border-white border-opacity-20"
                  style={{ maxHeight: '480px', objectFit: 'cover', width: '100%' }}
                />
                <div
                  className="position-absolute bottom-0 start-0 translate-middle-y bg-white text-dark p-3 rounded-3 shadow-lg ms-4 border-0 d-flex align-items-center gap-3"
                  style={{ maxWidth: '260px' }}
                >
                  <div className="bg-success text-white p-2 rounded-circle">
                    <FaCheckCircle size={20} />
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small">Satisfaction Guaranteed</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>Instant free rework if not satisfied</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Container Content */}
      <Container className="py-5">
        {/* Categories Section */}
        <section className="mb-5 pb-3">
          <div className="section-heading text-center mb-5">
            <span className="overline text-primary fw-bold text-uppercase">What are you looking for?</span>
            <h2 className="fw-bold display-6 mb-2">Explore by Category</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              Select a specialized category to find certified and insured experts in your neighborhood.
            </p>
          </div>

          <Row className="g-3">
            {categories.map((cat, index) => {
              const IconComp = cat.icon;
              return (
                <Col lg={3} md={4} sm={6} key={index}>
                  <Link
                    to={`/services?category=${cat.value}`}
                    className="text-decoration-none text-dark d-block h-100"
                  >
                    <Card className="category-card h-100 p-3 text-center border-0 shadow-sm">
                      <div
                        className="category-icon mb-3"
                        style={{ color: cat.color }}
                      >
                        <IconComp size={28} />
                      </div>
                      <h6 className="fw-bold mb-1 text-dark">{cat.name}</h6>
                      <span className="text-muted small">{cat.count}</span>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </section>

        {/* Featured Services Section */}
        <section className="mb-5 pb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="overline text-primary fw-bold text-uppercase">Handpicked for you</span>
              <h2 className="fw-bold mb-1">Featured Services</h2>
              <p className="text-muted mb-0">High-demand home services delivered with premium quality assurance.</p>
            </div>
            <Button as={Link} to="/services" variant="outline-primary" className="mt-3 mt-md-0 fw-semibold">
              View All Services
            </Button>
          </div>

          <Row className="g-4">
            {featuredServices.map((service) => (
              <Col lg={3} md={6} key={service.id}>
                <Card className="service-card h-100 border-0 shadow-sm d-flex flex-column">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={service.image}
                      style={{ height: '180px', objectFit: 'cover' }}
                      alt={service.name}
                    />
                    <Badge
                      bg="dark"
                      className="position-absolute top-0 end-0 m-3 px-2 py-1 shadow-sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {service.badge}
                    </Badge>
                  </div>
                  <Card.Body className="d-flex flex-column p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg="primary-soft" className="text-primary text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {service.category.replace('-', ' ')}
                      </Badge>
                      <div className="d-flex align-items-center gap-1 text-warning small fw-bold">
                        <FaStar size={13} /> {service.rating}
                        <span className="text-muted fw-normal">({service.reviews})</span>
                      </div>
                    </div>

                    <Card.Title className="fw-bold fs-6 mb-2 text-dark">{service.name}</Card.Title>
                    <Card.Text className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.5' }}>
                      {service.description}
                    </Card.Text>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                      <div>
                        <span className="text-muted small d-block">Starting from</span>
                        <span className="fw-bold fs-5 text-dark">₹{service.price}</span>
                      </div>
                      <Button
                        as={Link}
                        to={`/services?category=${service.category}`}
                        variant="primary"
                        size="sm"
                        className="px-3 fw-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Why Choose Service Sphere */}
        <section className="mb-5 py-4">
          <div className="section-heading text-center mb-5">
            <span className="overline text-primary fw-bold text-uppercase">The Service Sphere Guarantee</span>
            <h2 className="fw-bold mb-2">Why 50,000+ Households Choose Us</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '520px' }}>
              We set the gold standard in service provider vetting, safety, and price transparency.
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-primary"
                  style={{ width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)' }}
                >
                  <FaShieldAlt size={26} />
                </div>
                <h5 className="fw-bold mb-2">Verified & Insured Pros</h5>
                <p className="text-muted small mb-0">
                  Every provider passes background verification, identity checks, and rigorous skill screenings.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-success"
                  style={{ width: '60px', height: '60px', background: 'rgba(16,185,129,0.1)' }}
                >
                  <FaCheckCircle size={26} />
                </div>
                <h5 className="fw-bold mb-2">Transparent Upfront Pricing</h5>
                <p className="text-muted small mb-0">
                  No hidden fees or surprise billings. You see exact base rates before booking any professional.
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-warning"
                  style={{ width: '60px', height: '60px', background: 'rgba(245,158,11,0.1)' }}
                >
                  <FaClock size={26} />
                </div>
                <h5 className="fw-bold mb-2">On-Time Service Delivery</h5>
                <p className="text-muted small mb-0">
                  Select your exact convenient date & time slot. Our technicians arrive right on schedule.
                </p>
              </div>
            </Col>
          </Row>
        </section>

        {/* Call to Action Banner */}
        <div className="cta-section my-5">
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="display-6 fw-bold mb-3 text-white">Ready for effortless home service?</h2>
              <p className="text-white-50 mb-4 lead">
                Join thousands of homeowners and verified service providers on India's most modern service marketplace.
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                <Button as={Link} to="/services" variant="light" size="lg" className="px-4 py-2 fw-bold shadow">
                  Browse All Services
                </Button>
                <Button as={Link} to="/provider/register" variant="outline-light" size="lg" className="px-4 py-2 fw-semibold">
                  Register as Provider
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default Home;
