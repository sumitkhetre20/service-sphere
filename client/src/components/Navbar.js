import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Navbar as BSNavbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Button
} from 'react-bootstrap';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaThLarge,
  FaTools,
  FaCalendarCheck,
  FaUsers,
  FaCompass
} from 'react-icons/fa';

const CustomNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'customer':
        return 'Customer Portal';
      case 'provider':
        return 'Provider Suite';
      case 'admin':
        return 'Admin Console';
      default:
        return 'Dashboard';
    }
  };

  return (
    <BSNavbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
      className={`ss-navbar ${scrolled ? 'scrolled shadow-sm' : ''}`}
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/" onClick={handleNavClick} className="d-flex align-items-center gap-2">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }}
          >
            <FaCompass size={18} />
          </div>
          <span className="fw-bolder fs-5 text-white tracking-tight">
            Service<span style={{ color: '#818cf8' }}>Sphere</span>
          </span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-navbar-nav" />

        <BSNavbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto ms-lg-4 gap-1">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleNavClick}
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/services"
              onClick={handleNavClick}
              active={location.pathname === '/services'}
            >
              Explore Services
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/about"
              onClick={handleNavClick}
              active={location.pathname === '/about'}
            >
              About
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/customer-support"
              onClick={handleNavClick}
              active={location.pathname === '/customer-support'}
            >
              Support
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to={getDashboardLink()}
                onClick={handleNavClick}
                active={
                  location.pathname.startsWith('/customer') ||
                  location.pathname.startsWith('/provider') ||
                  location.pathname.startsWith('/admin')
                }
                className="d-flex align-items-center gap-1"
              >
                <FaThLarge size={13} className="text-primary-light" />
                {getDashboardLabel()}
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {isAuthenticated ? (
              <NavDropdown
                title={
                  <div className="d-inline-flex align-items-center gap-2 text-white">
                    <div
                      className="rounded-circle bg-primary-soft d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                      <FaUserCircle size={18} className="text-white" />
                    </div>
                    <span className="fw-semibold">{user.name}</span>
                    <Badge bg="primary" className="text-uppercase" style={{ fontSize: '0.65rem' }}>
                      {user.role}
                    </Badge>
                  </div>
                }
                id="user-profile-dropdown"
                align="end"
                className="user-nav-dropdown"
              >
                <div className="px-3 py-2 border-bottom">
                  <p className="mb-0 fw-bold small text-dark">{user.name}</p>
                  <p className="mb-0 text-muted small">{user.email}</p>
                </div>

                <NavDropdown.Item
                  as={Link}
                  to={`/${user.role}/profile`}
                  onClick={handleNavClick}
                  className="d-flex align-items-center gap-2 py-2"
                >
                  <FaUserCircle size={14} className="text-muted" /> My Account
                </NavDropdown.Item>

                {user.role === 'customer' && (
                  <NavDropdown.Item
                    as={Link}
                    to="/customer/bookings"
                    onClick={handleNavClick}
                    className="d-flex align-items-center gap-2 py-2"
                  >
                    <FaCalendarCheck size={14} className="text-muted" /> My Bookings
                  </NavDropdown.Item>
                )}

                {user.role === 'provider' && (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/provider/services"
                      onClick={handleNavClick}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <FaTools size={14} className="text-muted" /> My Services
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/provider/bookings"
                      onClick={handleNavClick}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <FaCalendarCheck size={14} className="text-muted" /> Service Bookings
                    </NavDropdown.Item>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/admin/users"
                      onClick={handleNavClick}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <FaUsers size={14} className="text-muted" /> User Directory
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/admin/services"
                      onClick={handleNavClick}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <FaTools size={14} className="text-muted" /> Platform Services
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/admin/bookings"
                      onClick={handleNavClick}
                      className="d-flex align-items-center gap-2 py-2"
                    >
                      <FaCalendarCheck size={14} className="text-muted" /> All Bookings
                    </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger py-2"
                >
                  <FaSignOutAlt size={14} /> Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={handleNavClick}
                  className="fw-semibold px-3 text-white"
                >
                  Sign In
                </Nav.Link>

                <NavDropdown
                  title={
                    <Button variant="primary" size="sm" className="px-3 fw-bold rounded-pill">
                      Register
                    </Button>
                  }
                  id="register-dropdown"
                  align="end"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/customer/register"
                    onClick={handleNavClick}
                    className="py-2"
                  >
                    <strong>Customer Account</strong>
                    <div className="small text-muted">Book verified service professionals</div>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={Link}
                    to="/provider/register"
                    onClick={handleNavClick}
                    className="py-2"
                  >
                    <strong>Service Provider</strong>
                    <div className="small text-muted">Offer your expertise and grow business</div>
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default CustomNavbar;
