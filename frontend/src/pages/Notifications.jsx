import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Spinner, Row, Col } from 'react-bootstrap';
import { BsBellFill, BsX } from 'react-icons/bs';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container className="mt-5">
      <h4 className="text-primary mb-4 d-flex align-items-center">
        <BsBellFill className="me-2" /> Notifications
      </h4>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-muted">No notifications available.</p>
      ) : (
        <Row xs={1} md={2} lg={2} className="g-4">
          {notifications.map((n) => (
            <Col key={n._id}>
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                  <strong>{n.title}</strong>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDismiss(n._id)}
                    aria-label="Dismiss"
                  >
                    <BsX />
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{n.message}</Card.Text>
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Notifications;
