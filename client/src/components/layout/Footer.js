import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCcVisa,
  FaCcMastercard,
  FaUniversity,
  FaArrowUp,
  FaCreditCard,
  FaCompass
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
    { name: 'Explore Services', href: '/services' },
    { name: 'About Service Sphere', href: '/about' },
    { name: 'Customer Support', href: '/customer-support' },
    { name: 'Become a Provider', href: '/provider/register' }
  ];

  const popularServices = [
    { name: 'Home Cleaning', href: '/services?category=home-cleaning' },
    { name: 'Plumbing Repairs', href: '/services?category=plumbing' },
    { name: 'Electrical Works', href: '/services?category=electrical' },
    { name: 'Beauty & Wellness', href: '/services?category=beauty' },
    { name: 'Carpentry Services', href: '/services?category=carpentry' },
    { name: 'Painting & Decor', href: '/services?category=painting' }
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' }
  ];

  return (
    <>
      <footer className="footer border-top border-dark">
        <div className="py-5">
          <Container>
            <Row className="gy-4">
              {/* Brand & About */}
              <Col lg={4} md={6}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: '34px',
                      height: '34px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    }}
                  >
                    <FaCompass size={18} />
                  </div>
                  <h5 className="mb-0 fw-bold text-white fs-5">Service Sphere</h5>
                </div>
                <p className="text-white-50 small mb-4 pe-lg-4" style={{ lineHeight: '1.7' }}>
                  The leading on-demand services marketplace connecting verified home service professionals with households across the city. Reliable, insured, and background-checked.
                </p>

                <div className="d-flex gap-2 mb-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="social-icon text-white text-decoration-none"
                      aria-label={social.label}
                    >
                      <social.icon size={13} />
                    </a>
                  ))}
                </div>

                <div>
                  <span className="text-white-50 small d-block mb-2 text-uppercase tracking-wider fw-semibold">
                    Supported Payments
                  </span>
                  <div className="d-flex gap-2">
                    <span className="payment-method px-2 py-1 text-white-50" title="UPI">
                      <FaUniversity size={16} />
                    </span>
                    <span className="payment-method px-2 py-1 text-white-50" title="Visa">
                      <FaCcVisa size={16} />
                    </span>
                    <span className="payment-method px-2 py-1 text-white-50" title="Mastercard">
                      <FaCcMastercard size={16} />
                    </span>
                    <span className="payment-method px-2 py-1 text-white-50" title="Card / Netbanking">
                      <FaCreditCard size={16} />
                    </span>
                  </div>
                </div>
              </Col>

              {/* Navigation Links */}
              <Col lg={2} md={6} sm={6}>
                <h6 className="text-white fw-bold mb-3">Navigation</h6>
                <Nav className="flex-column gap-2">
                  {quickLinks.map((link, index) => (
                    <Nav.Link
                      key={index}
                      as={Link}
                      to={link.href}
                      className="text-white-50 text-decoration-none p-0 quick-link small"
                    >
                      {link.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </Col>

              {/* Top Categories */}
              <Col lg={3} md={6} sm={6}>
                <h6 className="text-white fw-bold mb-3">Popular Services</h6>
                <Nav className="flex-column gap-2">
                  {popularServices.map((service, index) => (
                    <Nav.Link
                      key={index}
                      as={Link}
                      to={service.href}
                      className="text-white-50 text-decoration-none p-0 quick-link small"
                    >
                      {service.name}
                    </Nav.Link>
                  ))}
                </Nav>
              </Col>

              {/* Contact Info */}
              <Col lg={3} md={6}>
                <h6 className="text-white fw-bold mb-3">Direct Support</h6>
                <div className="d-flex flex-column gap-3 small text-white-50">
                  <div className="d-flex align-items-center gap-2">
                    <FaPhoneAlt className="text-primary" size={13} />
                    <span>+91 95799 39421</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaEnvelope className="text-primary" size={13} />
                    <span>support@servicesphere.com</span>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <FaMapMarkerAlt className="text-primary mt-1" size={13} />
                    <span>Tech Hub Park, Pune, Maharashtra 411001</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FaClock className="text-primary" size={13} />
                    <span>Mon – Sat: 8:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Bottom Subfooter */}
        <div className="py-3 border-top border-secondary border-opacity-25 bg-black bg-opacity-30">
          <Container>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 text-white-50 small">
              <div>© {new Date().getFullYear()} Service Sphere Inc. All rights reserved.</div>
              <div className="d-flex gap-3">
                <Link to="/about" className="text-white-50 text-decoration-none">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/about" className="text-white-50 text-decoration-none">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link to="/customer-support" className="text-white-50 text-decoration-none">
                  Help Center
                </Link>
              </div>
            </div>
          </Container>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
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
