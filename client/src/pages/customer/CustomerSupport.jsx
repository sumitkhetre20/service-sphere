import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { 
  FaUndo, 
  FaTimesCircle, 
  FaShieldAlt, 
  FaUserCheck, 
  FaCreditCard, 
  FaStar, 
  FaIdCard, 
  FaHeadset, 
  FaChartLine 
} from 'react-icons/fa';
import './CustomerSupport.css';

const CustomerSupport = () => {
  return (
    <div className="customer-support-page py-5">
      <Container>
        {/* Page Title */}
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="display-4 fw-bold text-primary mb-4">Customer Support</h1>
            <p className="lead text-muted">
              We're here to help with any questions or concerns about our services
            </p>
          </Col>
        </Row>

        {/* Support Sections */}
        <Row className="g-4">
          {/* Refund Policy Card */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm support-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaUndo className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Refund Policy</h4>
                </div>
                <div className="policy-list">
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Full refund if provider cancels</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Full refund if service not delivered</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Partial refund if verified quality issue</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">No refund after successful completion without complaint</span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Refund processed in 5–7 business days</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Cancellation Policy Card */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm support-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaTimesCircle className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Cancellation Policy</h4>
                </div>
                <div className="policy-list">
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Free cancellation up to 2 hours before service</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Late cancellation may incur 10–20% fee</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">No cancellation after service started</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Provider cancellation leads to full refund</span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="policy-bullet"></div>
                    <span className="text-muted">Alternate provider may be assigned automatically</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Safety & Trust Card */}
          <Col lg={4} md={6} className="mb-4">
            <Card className="h-100 border-0 shadow-sm support-card">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaShieldAlt className="text-primary me-3" size={24} />
                  <h4 className="mb-0">Safety & Trust</h4>
                </div>
                <div className="policy-list">
                  <div className="d-flex align-items-start mb-2">
                    <FaUserCheck className="text-primary me-2" size={16} />
                    <span className="text-muted">Verified professionals</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <FaCreditCard className="text-primary me-2" size={16} />
                    <span className="text-muted">Secure payment gateway</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <FaStar className="text-primary me-2" size={16} />
                    <span className="text-muted">Ratings and reviews system</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <FaIdCard className="text-primary me-2" size={16} />
                    <span className="text-muted">Identity verification</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <FaHeadset className="text-primary me-2" size={16} />
                    <span className="text-muted">Emergency support</span>
                  </div>
                  <div className="d-flex align-items-start">
                    <FaChartLine className="text-primary me-2" size={16} />
                    <span className="text-muted">Quality monitoring</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CustomerSupport;
