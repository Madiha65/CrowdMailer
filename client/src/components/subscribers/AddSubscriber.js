import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Form, Button, Container } from 'react-bootstrap';

const AddSubscriber = () => {
  const [subscriber, setSubscriber] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubscriber(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/subscribers', subscriber);
      navigate('/subscribers');
    } catch (error) {
      console.error('Error adding subscriber:', error);
      alert('Failed to add subscriber');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Add Subscriber</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={subscriber.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={subscriber.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Subscriber'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddSubscriber;