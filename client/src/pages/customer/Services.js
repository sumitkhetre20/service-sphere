import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await api.get('/services', { params });
      
      // Validate response data structure
      if (!response?.data) {
        throw new Error('Invalid response structure');
      }
      
      setServices(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services. Please try again.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(clearedFilters).forEach(([key, val]) => {
      if (val) params.append(key, val);
    });
    setSearchParams(params);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="rating-stars">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="rating-stars">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-muted">☆</span>);
    }

    return stars;
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Services</h1>
        <Button variant="outline-primary" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search services..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Services Grid */}
          {console.log('=== RENDER DEBUG ===', { loading, servicesLength: services.length, services })}
          {services.length === 0 ? (
            <div className="text-center py-5">
              <h3>No services found</h3>
              <p className="text-muted">Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <Row>
              {services.map((service) => (
                <Col md={6} lg={4} className="mb-4" key={service._id}>
                  <Card className="h-100 service-card">
                    {service.images?.length > 0 && (
                      <Card.Img 
                        variant="top" 
                        src={service.images[0]} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="mb-0">{service.name}</Card.Title>
                        <Badge bg="primary">₹{service.price.basePrice}</Badge>
                      </div>
                      
                      <Card.Text className="text-muted mb-2">
                        {service.description.substring(0, 100)}...
                      </Card.Text>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          {renderStars(service.rating)}
                          <small className="text-muted ms-1">
                            ({service.totalReviews || 0})
                          </small>
                        </div>
                        <Badge bg="secondary">{service.category}</Badge>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          by {service.provider?.name}
                        </small>
                        <Button 
                          as={Link} 
                          to={`/services/${service._id}`}
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
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <div className="btn-group">
                <Button
                  variant="outline-primary"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="btn btn-outline-primary" disabled>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline-primary"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Services;
