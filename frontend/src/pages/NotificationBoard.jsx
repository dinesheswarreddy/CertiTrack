// src/components/NotificationBoard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function NotificationBoard() {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({ title: '', message: '' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
    const navigate = useNavigate();
  

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Post notification
  const postNotification = async (e) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/notifications', newNotification, { headers });
      setNewNotification({ title: '', message: '' });
      fetchNotifications();
    } catch (err) {
      console.error('Error posting notification:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await axios.delete(`http://localhost:5000/api/notifications/${id}`, { headers });
        fetchNotifications();
      } catch (err) {
        console.error('Error deleting notification:', err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Container className="mt-4">
      <Button className="mb-3" variant="secondary" onClick={() => navigate('/dashboard/admin')}>
              ← Back to Dashboard
            </Button>
      <h3 className="text-primary mb-3">📢 Notifications</h3>

      {/* Post New Notification */}
      <Card className="p-3 mb-4 shadow-sm">
        <h5>Post New Notification</h5>
        <Form onSubmit={postNotification}>
          <Form.Control
            placeholder="Title"
            value={newNotification.title}
            onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
            className="mb-2"
          />
          <Form.Control
            placeholder="Message"
            as="textarea"
            rows={3}
            value={newNotification.message}
            onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
            className="mb-2"
          />
          <Button type="submit" variant="success">Post</Button>
        </Form>
      </Card>

      {/* List All Notifications */}
      <h5 className="mb-3">All Notifications</h5>
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map(n => (
          <Card key={n._id} className="mb-2 shadow-sm">
            <Card.Body>
              <Card.Title>{n.title}</Card.Title>
              <Card.Text>{n.message}</Card.Text>
              <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
              <Button
                variant="danger"
                size="sm"
                className="float-end"
                onClick={() => deleteNotification(n._id)}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default NotificationBoard;
