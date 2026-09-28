import React from 'react';
import { Container, Row, Col, Card, Accordion, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageHero from '../../components/ui/PageHero';
import {
  FaUndo,
  FaTimesCircle,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import './CustomerSupport.css';

const CustomerSupport = () => {
  const faqs = [
    {
      q: 'How do I reschedule or cancel my service booking?',
      a: 'You can reschedule or cancel directly from your "My Bookings" page up to 2 hours before the scheduled appointment without any cancellation fee.'
    },
    {
      q: 'Are the service professionals verified and background checked?',
      a: 'Yes, 100% of our service providers undergo government ID validation, criminal background verification, and trade skill certifications before they can accept bookings.'
    },
    {
      q: 'When do I need to pay for my booked service?',
      a: 'Payment is only processed or settled after the service is delivered and you are completely satisfied with the quality of work performed.'
    },
    {
      q: 'What if I am unhappy with the service provided?',
      a: 'We offer a 100% Service Sphere Satisfaction Guarantee. If work quality fails to meet standard expectations, we provide a free inspection and rework within 48 hours.'
    },
    {
      q: 'How long do refunds take to reflect in my bank account?',
      a: 'Approved refund amounts are initiated immediately and reflect in your original payment method (Bank / UPI / Card) within 5 to 7 working business days.'
    }
  ];

  return (
    <div className="customer-support-page bg-light" style={{ minHeight: '85vh' }}>
      <PageHero
        badge="Help & Assistance"
        title="We're Here to Help"
        subtitle="Need help with a booking, payment, or service provider? Our dedicated support team is available 6 days a week."
      />

      <Container className="py-5">
        {/* Contact Channels Grid */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-primary"
                style={{ width: '56px', height: '56px', background: 'rgba(99,102,241,0.1)' }}
              >
                <FaPhoneAlt size={22} />
              </div>
              <h5 className="fw-bold text-dark mb-1">Phone Helpline</h5>
              <p className="text-muted small mb-2">Speak directly with an agent</p>
              <div className="fw-bold text-primary fs-5 mb-1">+91 95799 39421</div>
              <span className="text-muted small">Mon–Sat: 8am–9pm</span>
            </div>
          </Col>

          <Col md={4}>
            <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-success"
                style={{ width: '56px', height: '56px', background: 'rgba(16,185,129,0.1)' }}
              >
                <FaEnvelope size={22} />
              </div>
              <h5 className="fw-bold text-dark mb-1">Email Support</h5>
              <p className="text-muted small mb-2">Send us a ticket or inquiry</p>
              <div className="fw-bold text-success fs-6 mb-1">support@servicesphere.com</div>
              <span className="text-muted small">Response in &lt; 2 hours</span>
            </div>
          </Col>

          <Col md={4}>
            <div className="p-4 bg-white rounded-4 border h-100 shadow-sm text-center">
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-warning"
                style={{ width: '56px', height: '56px', background: 'rgba(245,158,11,0.1)' }}
              >
                <FaMapMarkerAlt size={22} />
              </div>
              <h5 className="fw-bold text-dark mb-1">Regional Office</h5>
              <p className="text-muted small mb-2">Visit our service station</p>
              <div className="fw-bold text-dark small mb-1">Tech Hub Park, Pune</div>
              <span className="text-muted small">Maharashtra 411001</span>
            </div>
          </Col>
        </Row>

        {/* Support & Policies Section */}
        <Row className="g-4 mb-5">
          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-primary"
                  style={{ width: '44px', height: '44px', background: 'rgba(99,102,241,0.1)' }}
                >
                  <FaUndo size={20} />
                </div>
                <h5 className="fw-bold mb-0 text-dark">Refund Policy</h5>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="text-primary fw-bold">•</span>
                  <span>100% full refund if provider is unable to attend.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-primary fw-bold">•</span>
                  <span>Partial or full rework if job does not meet specifications.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-primary fw-bold">•</span>
                  <span>Refund processed to original method within 5–7 business days.</span>
                </li>
              </ul>
            </Card>
          </Col>

          <Col lg={4} md={6}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-danger"
                  style={{ width: '44px', height: '44px', background: 'rgba(239,68,68,0.1)' }}
                >
                  <FaTimesCircle size={20} />
                </div>
                <h5 className="fw-bold mb-0 text-dark">Cancellation Policy</h5>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="text-danger fw-bold">•</span>
                  <span>Free, no-question cancellation up to 2 hours prior to slot.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-danger fw-bold">•</span>
                  <span>Rescheduling is always free anytime from your portal.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-danger fw-bold">•</span>
                  <span>If pro cancels, we immediately match another top pro.</span>
                </li>
              </ul>
            </Card>
          </Col>

          <Col lg={4} md={12}>
            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-3 d-flex align-items-center justify-content-center text-success"
                  style={{ width: '44px', height: '44px', background: 'rgba(16,185,129,0.1)' }}
                >
                  <FaShieldAlt size={20} />
                </div>
                <h5 className="fw-bold mb-0 text-dark">Safety & Escrow</h5>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small mb-0">
                <li className="d-flex align-items-start gap-2">
                  <span className="text-success fw-bold">•</span>
                  <span>ID & criminal records checked for all active partners.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-success fw-bold">•</span>
                  <span>256-bit encrypted secure payment gateways.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <span className="text-success fw-bold">•</span>
                  <span>Dedicated rapid incident dispatch team.</span>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* Frequently Asked Questions Accordion */}
        <div className="bg-white rounded-4 border p-4 p-md-5 mb-5 shadow-sm">
          <div className="text-center mb-4">
            <span className="overline text-primary fw-bold text-uppercase">Got Questions?</span>
            <h3 className="fw-bold text-dark">Frequently Asked Questions</h3>
          </div>

          <Accordion defaultActiveKey="0" className="border-0">
            {faqs.map((faq, index) => (
              <Accordion.Item eventKey={String(index)} key={index} className="mb-3 border rounded-3 overflow-hidden">
                <Accordion.Header>
                  <span className="fw-semibold text-dark">{faq.q}</span>
                </Accordion.Header>
                <Accordion.Body className="text-secondary small" style={{ lineHeight: '1.7' }}>
                  {faq.a}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>

        {/* CTA Banner */}
        <div className="cta-section text-center p-4 p-md-5 rounded-4 shadow">
          <h3 className="fw-bold mb-2 text-white">Still have questions?</h3>
          <p className="text-white-50 mx-auto mb-4" style={{ maxWidth: '500px' }}>
            Our customer service specialists are on standby to help resolve any issue promptly.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/services" variant="light" className="fw-bold px-4">
              Browse Services
            </Button>
            <Button as={Link} to="/login" variant="outline-light" className="px-4 fw-semibold">
              Sign In
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CustomerSupport;
