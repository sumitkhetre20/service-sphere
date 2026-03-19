import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const featuredServices = [
    { id: 1, name: 'Home Cleaning', category: 'home-cleaning', description: 'Professional home cleaning services', price: 500 },
    { id: 2, name: 'Plumbing Services', category: 'plumbing', description: 'Expert plumbing repairs and installation', price: 800 },
    { id: 3, name: 'Electrical Work', category: 'electrical', description: 'Licensed electricians for all your needs', price: 600 },
    { id: 4, name: 'Beauty Services', category: 'beauty', description: 'Professional beauty and wellness services', price: 1200 },
  ];

  const categories = [
    { name: 'Home Cleaning', value: 'home-cleaning', icon: '🧹' },
    { name: 'Plumbing', value: 'plumbing', icon: '🔧' },
    { name: 'Electrical', value: 'electrical', icon: '⚡' },
    { name: 'Carpentry', value: 'carpentry', icon: '🔨' },
    { name: 'Painting', value: 'painting', icon: '🎨' },
    { name: 'Beauty', value: 'beauty', icon: '💄' },
    { name: 'Fitness', value: 'fitness', icon: '💪' },
    { name: 'Tutoring', value: 'tutoring', icon: '📚' },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="page-header text-center">
        <Container>
          <h1 className="display-4 fw-bold mb-4">Welcome to Service Sphere</h1>
          <p className="lead mb-4">
            Connect with trusted professionals for all your service needs
          </p>
          {isAuthenticated ? (
            <div>
              <h3 className="mb-3">Welcome back, {user?.name}!</h3>
              <Button as={Link} to="/services" variant="light" size="lg" className="me-3">
                Browse Services
              </Button>
              {user?.role === 'provider' && (
                <Button as={Link} to="/provider/services" variant="outline-light" size="lg">
                  Manage Your Services
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Button as={Link} to="/services" variant="light" size="lg" className="me-3">
                Browse Services
              </Button>
              <Button as={Link} to="/register" variant="outline-light" size="lg">
                Join as Provider
              </Button>
            </div>
          )}
        </Container>
      </div>

      <Container className="py-5">
        {/* Categories Section */}
        <section className="mb-5">
          <h2 className="text-center mb-4">Popular Categories</h2>
          <Row>
            {categories.map((category, index) => (
              <Col md={3} sm={6} className="mb-3" key={index}>
                <Card className="h-100 text-center service-card">
                  <Card.Body className="d-flex flex-column justify-content-center">
                    <div className="display-4 mb-3">{category.icon}</div>
                    <Card.Title>{category.name}</Card.Title>
                    <Button 
                      as={Link} 
                      to={`/services?category=${category.value}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      View Services
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Services Section */}
        <section>
          <h2 className="text-center mb-4">Featured Services</h2>
          <Row>
            {featuredServices.map((service) => (
              <Col md={6} lg={3} className="mb-4" key={service.id}>
                <Card className="h-100 service-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0">{service.name}</Card.Title>
                      <Badge bg="primary">₹{service.price}</Badge>
                    </div>
                    <Card.Text className="text-muted mb-3">
                      {service.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="secondary">{service.category}</Badge>
                      <Button 
                        as={Link} 
                        to={`/services?category=${service.category}`}
                        variant="outline-primary"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Call to Action Section */}
        <section className="text-center mt-5 py-5 bg-light rounded">
          <Row className="justify-content-center">
            <Col md={8}>
              <h3 className="mb-3">Ready to get started?</h3>
              <p className="lead mb-4">
                Join thousands of satisfied customers who trust Service Sphere for their service needs
              </p>
              <div>
                <Button as={Link} to="/services" variant="primary" size="lg" className="me-3">
                  Find Services
                </Button>
                <Button as={Link} to="/register" variant="outline-primary" size="lg">
                  Become a Provider
                </Button>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default Home;
