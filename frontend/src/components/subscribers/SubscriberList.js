import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Badge, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
const SubscriberList = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await api.get('/subscribers');
        setSubscribers(response.data);
      } catch (error) {
        console.error('Error fetching subscribers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await api.delete(`/subscribers/${id}`);
        setSubscribers(subscribers.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Failed to delete subscriber');
      }
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? <Badge bg="success">Active</Badge> 
      : <Badge bg="danger">Unsubscribed</Badge>;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Subscribers</h1>
        <Link to="/subscribers/add" className="btn btn-primary">
          Add Subscriber
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(subscriber => (
            <tr key={subscriber._id}>
              <td>{subscriber.name}</td>
              <td>{subscriber.email}</td>
              <td>{getStatusBadge(subscriber.status)}</td>
              <td>{new Date(subscriber.createdAt).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(subscriber._id)}
                >
            <RiDeleteBinLine/>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SubscriberList;