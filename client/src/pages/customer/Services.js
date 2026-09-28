import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import api from '../../utils/axiosInterceptor';
import SkeletonCard from '../../components/ui/SkeletonCard';
import StarRating from '../../components/ui/StarRating';
import EmptyState from '../../components/ui/EmptyState';
import PageHero from '../../components/ui/PageHero';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

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
    limit: 9,
    total: 0,
    pages: 0
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services/categories');
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
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

      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await api.get('/services', { params });

      if (!response?.data) {
        throw new Error('Invalid response structure');
      }

      setServices(response.data.data || []);
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }));
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Unable to load services at this time. Please try refreshing or adjust filters.');
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
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    filters.category || filters.search || filters.minPrice || filters.maxPrice
  );

  return (
    <>
      <PageHero
        badge="Marketplace"
        title="Find & Book Trusted Local Services"
        subtitle="Explore verified experts across cleaning, repairs, electrical, beauty, and maintenance."
      />

      <Container className="py-5">
        {/* Search & Filter Toolbar */}
        <Card className="border-0 shadow-sm rounded-4 mb-4 p-3 bg-white">
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-center">
              {/* Keyword Search */}
              <Col lg={4} md={6}>
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={14} />
                  <Form.Control
                    type="text"
                    placeholder="Search by service name or keywords..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </Col>

              {/* Category Dropdown */}
              <Col lg={3} md={6}>
                <Form.Select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Service Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/* Price Range */}
              <Col lg={2} sm={6}>
                <Form.Control
                  type="number"
                  placeholder="Min Price (₹)"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </Col>
              <Col lg={2} sm={6}>
                <Form.Control
                  type="number"
                  placeholder="Max Price (₹)"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </Col>

              {/* Clear / Filter Actions */}
              <Col lg={1} md={12} className="text-end">
                {hasActiveFilters && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearFilters}
                    className="w-100 d-flex align-items-center justify-content-center gap-1 py-2"
                    title="Clear all filters"
                  >
                    <FaTimes size={12} /> Clear
                  </Button>
                )}
              </Col>
            </Row>

            {/* Sort Sub-row */}
            <div className="d-flex justify-content-between align-items-center pt-3 mt-3 border-top flex-wrap gap-2">
              <div className="text-muted small">
                Showing <strong className="text-dark">{services.length}</strong> services
                {pagination.total > 0 && ` of ${pagination.total}`}
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small fw-semibold">Sort By:</span>
                <Form.Select
                  size="sm"
                  style={{ width: 'auto' }}
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
              </div>
            </div>
          </Form>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" className="mb-4 d-flex align-items-center justify-content-between">
            <span>{error}</span>
            <Button variant="outline-danger" size="sm" onClick={fetchServices}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Services List / Skeletons */}
        <Row className="g-4">
          {loading ? (
            <SkeletonCard count={6} />
          ) : services.length === 0 ? (
            <Col xs={12}>
              <EmptyState
                icon="🔍"
                title="No Services Found"
                description="We couldn't find any services matching your criteria. Try adjusting the category, search term, or price range."
                actionText="Reset All Filters"
                onAction={clearFilters}
              />
            </Col>
          ) : (
            services.map((service) => (
              <Col md={6} lg={4} key={service._id}>
                <Card className="service-card h-100 border-0 shadow-sm overflow-hidden d-flex flex-column">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={
                        service.images?.[0] ||
                        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80'
                      }
                      style={{ height: '210px', objectFit: 'cover' }}
                      alt={service.name}
                    />
                    <Badge
                      bg="dark"
                      className="position-absolute top-0 end-0 m-3 px-2 py-1 shadow-sm text-capitalize"
                    >
                      {service.category?.replace('-', ' ')}
                    </Badge>
                  </div>

                  <Card.Body className="d-flex flex-column p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="fw-bold fs-5 mb-0 text-dark">
                        <Link to={`/services/${service._id}`} className="text-dark text-decoration-none">
                          {service.name}
                        </Link>
                      </Card.Title>
                    </div>

                    <p className="text-muted small mb-3 flex-grow-1" style={{ lineHeight: '1.6' }}>
                      {service.description?.length > 110
                        ? `${service.description.substring(0, 110)}...`
                        : service.description}
                    </p>

                    <div className="d-flex align-items-center justify-content-between mb-3 pt-2">
                      <StarRating
                        rating={service.rating || 0}
                        totalReviews={service.totalReviews || 0}
                        size={14}
                      />
                      {service.duration && (
                        <span className="text-muted small d-flex align-items-center gap-1">
                          <FaRegClock size={12} /> {service.duration} {service.price?.unit || 'hr'}
                        </span>
                      )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                      <div>
                        <span className="text-muted small d-block">Starting from</span>
                        <div className="d-flex align-items-baseline gap-1">
                          <span className="fw-bold fs-4 text-primary">₹{service.price?.basePrice}</span>
                          <span className="text-muted small">/{service.price?.unit || 'job'}</span>
                        </div>
                      </div>

                      <Button
                        as={Link}
                        to={`/services/${service._id}`}
                        variant="primary"
                        className="px-3 fw-semibold"
                      >
                        Book Now
                      </Button>
                    </div>

                    {service.provider?.name && (
                      <div className="mt-2 pt-2 border-top text-muted" style={{ fontSize: '0.78rem' }}>
                        Offered by <strong className="text-dark">{service.provider.name}</strong>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <div className="btn-group shadow-sm">
              <Button
                variant="outline-primary"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3"
              >
                Previous
              </Button>
              <span className="btn btn-outline-primary active disabled px-4 fw-bold">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline-primary"
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default Services;
