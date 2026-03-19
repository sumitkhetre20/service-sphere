import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaHome, 
  FaHandshake, 
  FaShieldAlt, 
  FaUsers, 
  FaStar, 
  FaChartLine 
} from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page py-5">
      <Container>
        {/* Hero Section */}
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">About Service Sphere</h1>
            <p className="lead text-muted mb-4">
              A modern digital marketplace connecting customers with skilled service professionals
            </p>
          </Col>
        </Row>

        {/* Main Content */}
        <Row className="g-4">
          {/* Introduction Card */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm about-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaHome className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Our Platform</h4>
                </div>
                <p className="text-muted">
                  Service Sphere is a modern digital marketplace designed to bridge the gap between customers 
                  and skilled service providers. We offer a wide range of home and personal services, including 
                  home cleaning, plumbing, electrical work, beauty & wellness, fitness training, tutoring, 
                  photography, and event planning.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Mission Card */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm about-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaHandshake className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Our Mission</h4>
                </div>
                <p className="text-muted">
                  Our platform focuses on delivering convenience, trust, and quality by enabling users to 
                  discover services, compare providers, read reviews, and book appointments seamlessly. 
                  We verify professionals, ensure transparent pricing, and provide secure payment options 
                  to create a reliable service ecosystem.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Vision Card */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm about-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaChartLine className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Our Vision</h4>
                </div>
                <p className="text-muted">
                  At Service Sphere, we aim to transform the traditional service industry into a 
                  technology-driven experience where customers receive dependable services and professionals 
                  gain better earning opportunities.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Core Values Card */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm about-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaShieldAlt className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Our Values</h4>
                </div>
                <div className="values-list">
                  <div className="d-flex align-items-center mb-3">
                    <FaUsers className="text-primary me-2" size={16} />
                    <span className="text-muted">Customer-Centric Approach</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaStar className="text-primary me-2" size={16} />
                    <span className="text-muted">Quality & Excellence</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaShieldAlt className="text-primary me-2" size={16} />
                    <span className="text-muted">Trust & Security</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Call to Action Section */}
        <Row className="mt-5">
          <Col className="text-center">
            <div className="cta-section p-4 rounded bg-primary bg-opacity-10">
              <h3 className="mb-3">Join Our Community</h3>
              <p className="text-muted mb-4">
                Whether you're looking for reliable services or want to grow your service business, 
                Service Sphere is here to help you succeed.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <a href="/services" className="btn btn-primary">
                  Browse Services
                </a>
                <a href="/provider/register" className="btn btn-outline-primary">
                  Become a Provider
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
