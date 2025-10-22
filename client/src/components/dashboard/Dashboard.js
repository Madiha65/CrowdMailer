import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    campaignsSent: 0,
    emailsSent: 0,
    openRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
      console.log(response.data, "data");

        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ marginLeft: '100px' }}>
      <h1 style={{ marginBottom: '50px' }}>Dashboard</h1>
      <Row className="g-4">
        <Col md={5}>
          <Card bg="primary" text="white" className="shadow-lg p-3 rounded-4">
            <Card.Body className="text-center">
              <Card.Title>Total Subscribers</Card.Title>
              <h2 className="fw-bold">{stats.totalSubscribers}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card bg="success" text="white" className="shadow-lg p-3 rounded-4">
            <Card.Body className="text-center">
              <Card.Title>Campaigns Sent</Card.Title>
              <h2 className="fw-bold">{stats.campaignsSent}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card bg="info" text="white" className="shadow-lg p-3 rounded-4">
            <Card.Body className="text-center">
              <Card.Title>Emails Sent</Card.Title>
              <h2 className="fw-bold">{stats.emailsSent}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card bg="warning" text="white" className="shadow-lg p-3 rounded-4">
            <Card.Body className="text-center">
              <Card.Title>Open Rate</Card.Title>
              <h2 className="fw-bold">{stats.openRate}%</h2>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </div>
  );
};

export default Dashboard;
