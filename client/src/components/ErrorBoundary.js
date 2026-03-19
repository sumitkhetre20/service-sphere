import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="text-center">
                <Card.Header className="bg-danger text-white">
                  <h3 className="mb-0">Oops! Something went wrong</h3>
                </Card.Header>
                <Card.Body>
                  <Alert variant="danger">
                    <Alert.Heading>Application Error</Alert.Heading>
                    <p>
                      We're sorry, but something unexpected happened. 
                      The application has encountered an error and needs to be reset.
                    </p>
                    <hr />
                    <p className="mb-0">
                      {process.env.NODE_ENV === 'development' && this.state.error && (
                        <small>
                          Error: {this.state.error.toString()}
                          <br />
                          {this.state.errorInfo.componentStack}
                        </small>
                      )}
                    </p>
                  </Alert>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button variant="primary" onClick={this.handleReset}>
                      Try Again
                    </Button>
                    <Button variant="outline-secondary" onClick={() => window.location.reload()}>
                      Reload Page
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
