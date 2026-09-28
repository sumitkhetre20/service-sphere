import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHero from '../../components/ui/PageHero';
import {
  FaHome,
  FaHandshake,
  FaShieldAlt,
  FaChartLine,
  FaCheckCircle
} from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page bg-light" style={{ minHeight: '85vh' }}>
      <PageHero
        badge="Our Story"
        title="Transforming Local Services With Technology"
        subtitle="Bridging households and certified professionals through transparency, trust, and exceptional execution."
      />

      <Container className="py-5">
        {/* Core Pillars */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                  style={{ width: '48px', height: '48px', background: 'rgba(99,102,241,0.1)' }}
                >
                  <FaHome size={22} />
                </div>
                <h4 className="fw-bold mb-0 text-dark">The Platform</h4>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                Service Sphere was created to eliminate the friction and uncertainty of finding reliable local service providers. From routine home cleaning and emergency plumbing to beauty treatments and electrical overhauls, we empower consumers with verified talent and guaranteed upfront rates.
              </p>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-success"
                  style={{ width: '48px', height: '48px', background: 'rgba(16,185,129,0.1)' }}
                >
                  <FaHandshake size={22} />
                </div>
                <h4 className="fw-bold mb-0 text-dark">Our Mission</h4>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                Our mission is to standardize service quality and build trust in urban communities. We achieve this by rigorously screening all technicians, standardizing job pricing, offering transparent cancellation policies, and collecting genuine verified client feedback.
              </p>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-warning"
                  style={{ width: '48px', height: '48px', background: 'rgba(245,158,11,0.1)' }}
                >
                  <FaChartLine size={22} />
                </div>
                <h4 className="fw-bold mb-0 text-dark">Our Vision</h4>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: '1.8' }}>
                To create a world where home care and maintenance are completely stress-free. By equipping skilled local tradespeople with digital dispatching, scheduling, and billing tools, we uplift livelihoods while delivering 5-star customer experiences.
              </p>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-danger"
                  style={{ width: '48px', height: '48px', background: 'rgba(239,68,68,0.1)' }}
                >
                  <FaShieldAlt size={22} />
                </div>
                <h4 className="fw-bold mb-0 text-dark">Core Values</h4>
              </div>
              <div className="d-flex flex-column gap-2 text-secondary">
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" size={14} />
                  <span><strong>Zero Hidden Costs:</strong> Honest upfront pricing before you book.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" size={14} />
                  <span><strong>Safety First:</strong> Complete criminal and credential background checks.</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheckCircle className="text-primary" size={14} />
                  <span><strong>Quality Re-work Warranty:</strong> Free rework if standard is not met.</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Platform Numbers */}
        <div className="bg-white rounded-4 border p-4 p-md-5 mb-5 shadow-sm text-center">
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="display-5 fw-black text-primary mb-1">50k+</div>
              <div className="text-muted small fw-semibold">Services Delivered</div>
            </Col>
            <Col md={3} sm={6}>
              <div className="display-5 fw-black text-dark mb-1">1,200+</div>
              <div className="text-muted small fw-semibold">Verified Professionals</div>
            </Col>
            <Col md={3} sm={6}>
              <div className="display-5 fw-black text-warning mb-1">4.9 ★</div>
              <div className="text-muted small fw-semibold">Average Rating</div>
            </Col>
            <Col md={3} sm={6}>
              <div className="display-5 fw-black text-success mb-1">100%</div>
              <div className="text-muted small fw-semibold">Insured Services</div>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div className="cta-section text-center p-5 rounded-4 shadow">
          <h2 className="fw-bold display-6 mb-3 text-white">Join the Service Sphere Ecosystem</h2>
          <p className="text-white-50 mx-auto mb-4 lead" style={{ maxWidth: '580px' }}>
            Whether you want peace of mind for your home maintenance or wish to expand your professional trades business, we are ready to assist.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button as={Link} to="/services" variant="light" size="lg" className="px-4 fw-bold shadow">
              Explore Services
            </Button>
            <Button as={Link} to="/provider/register" variant="outline-light" size="lg" className="px-4 fw-semibold">
              Register as Provider
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
