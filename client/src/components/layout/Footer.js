import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCcVisa,
  FaCcMastercard,
  FaUniversity,
  FaArrowUp,
  FaCreditCard
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Become Provider', href: '/become-provider' },
    { name: 'About Us', href: '/about' }
  ];

  const popularServices = [
    { name: 'House Cleaning', href: '/services?category=home-cleaning' },
    { name: 'Plumbing', href: '/services?category=plumbing' },
    { name: 'Electrical', href: '/services?category=electrical' },
    { name: 'Beauty & Wellness', href: '/services?category=beauty' },
    { name: 'Fitness', href: '/services?category=fitness' },
    { name: 'Photography', href: '/services?category=photography' },
    { name: 'Tutoring', href: '/services?category=tutoring' },
    { name: 'Event Planning', href: '/services?category=event-planning' }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' }
  ];

  const paymentMethods = [
    { icon: FaUniversity, label: 'UPI' },
    { icon: FaCcVisa, label: 'Visa' },
    { icon: FaCcMastercard, label: 'Mastercard' },
    { icon: FaCreditCard, label: 'Razorpay' }
  ];

  return (
    <>
      <footer className="footer">
        {/* Compact Footer Content */}
        <div className="py-3">
          <Container>
            <Row>
              {/* About Section */}
              <Col md={3} className="mb-3">
                <h5 className="mb-2">Service Sphere</h5>
                <p className="text-white-50 small mb-3">
                  Trusted platform connecting customers with verified professionals 
                  for home and personal services.
                </p>
                
                {/* Social Media Icons */}
                <div className="d-flex gap-2 mb-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`social-icon text-white d-flex align-items-center justify-content-center rounded-circle ${social.label.toLowerCase()}`}
                      style={{ width: '30px', height: '30px' }}
                      aria-label={social.label}
                    >
                      <social.icon size={12} />
                    </a>
                  ))}
                </div>

                {/* Payment Methods */}
                <div>
                  <h6 className="text-white-50 small mb-2">Payment Methods</h6>
                  <div className="d-flex gap-2 flex-wrap">
                    {paymentMethods.map((payment, index) => (
                      <div
                        key={index}
                        className="payment-method p-1 rounded d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '20px' }}
                        title={payment.label}
                      >
                        <payment.icon size={14} className="text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              {/* Quick Links */}
              <Col md={3} className="mb-3">
                <h6 className="mb-2">Quick Links</h6>
                <Nav className="flex-column">
                  {quickLinks.map((link, index) => (
                    <Nav.Link
                      key={index}
                      href={link.href}
                      className="text-white-50 text-decoration-none mb-1 p-0 quick-link"
                    >
                      {link.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </Col>

              {/* Popular Services */}
              <Col md={3} className="mb-3">
                <h6 className="mb-2">Popular Services</h6>
                <Nav className="flex-column">
                  {popularServices.map((service, index) => (
                    <Nav.Link
                      key={index}
                      href={service.href}
                      className="text-white-50 text-decoration-none mb-1 p-0 quick-link"
                    >
                      {service.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </Col>

              {/* Contact & Support */}
              <Col md={3} className="mb-3">
                <h6 className="mb-2">Contact & Support</h6>
                
                {/* Contact Information */}
                <div className="contact-info mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="text-primary me-2" size={12} />
                    <span className="text-white-50 small">+91 9579939421</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-primary me-2" size={12} />
                    <span className="text-white-50 small">support@servicesphere.com</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <FaMapMarkerAlt className="text-primary me-2" size={12} />
                    <span className="text-white-50 small">Pune, Maharashtra</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaClock className="text-primary me-2" size={12} />
                    <span className="text-white-50 small">Mon–Sat 9am–8pm</span>
                  </div>
                </div>

                {/* Customer Support Link */}
                <div>
                  <h6 className="text-white-50 small mb-2">Customer Support</h6>
                  <Nav.Link 
                    as={Link} 
                    to="/customer-support" 
                    className="text-white-50 text-decoration-none mb-0 p-0 quick-link"
                  >
                    Customer Support
                  </Nav.Link>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Minimal Copyright Section */}
        <div className="bg-dark bg-opacity-50 py-2 border-top border-secondary">
          <Container>
            <Row>
              <Col className="text-center">
                <small className="text-white-50">
                  © 2026 Service Sphere. All rights reserved.
                </small>
              </Col>
            </Row>
          </Container>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default Footer;
