import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Navbar as BSNavbar, 
  Nav, 
  Container, 
  NavDropdown, 
  Badge
} from 'react-bootstrap';

const CustomNavbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

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
        return 'My Dashboard';
      case 'provider':
        return 'Dashboard';
      case 'admin':
        return 'Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <BSNavbar 
      bg="primary" 
      variant="dark" 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      sticky="top"
    >
      <Container>
        <BSNavbar.Brand as={Link} to="/" onClick={handleNavClick} className="d-flex align-items-center">
          <strong>Service Sphere</strong>
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
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
              Services
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/about" 
              onClick={handleNavClick}
              active={location.pathname === '/about'}
            >
              About
            </Nav.Link>

            {isAuthenticated && (
              <Nav.Link 
                as={Link} 
                to={getDashboardLink()} 
                onClick={handleNavClick}
                active={location.pathname.startsWith('/customer') || 
                       location.pathname.startsWith('/provider') || 
                       location.pathname.startsWith('/admin')}
              >
                {getDashboardLabel()}
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <>
                    {user.name}
                    {user.role && (
                      <Badge bg="secondary" className="ms-2">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    )}
                  </>
                } 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to={`/${user.role}/profile`}
                  onClick={handleNavClick}
                >
                  Profile
                </NavDropdown.Item>
                
                {user.role === 'provider' && (
                  <>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/provider/services"
                      onClick={handleNavClick}
                    >
                      Manage Services
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/provider/bookings"
                      onClick={handleNavClick}
                    >
                      Manage Bookings
                    </NavDropdown.Item>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/admin/users"
                      onClick={handleNavClick}
                    >
                      Manage Users
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/admin/services"
                      onClick={handleNavClick}
                    >
                      Manage Services
                    </NavDropdown.Item>
                    <NavDropdown.Item 
                      as={Link} 
                      to="/admin/bookings"
                      onClick={handleNavClick}
                    >
                      Manage Bookings
                    </NavDropdown.Item>
                  </>
                )}
                
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  onClick={handleNavClick}
                  active={location.pathname === '/login'}
                >
                  Login
                </Nav.Link>
                
                <NavDropdown title="Register" active={location.pathname.includes('/register')}>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/customer/register" 
                    onClick={handleNavClick}
                  >
                    Register as Customer
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/provider/register" 
                    onClick={handleNavClick}
                  >
                    Register as Provider
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default CustomNavbar;
