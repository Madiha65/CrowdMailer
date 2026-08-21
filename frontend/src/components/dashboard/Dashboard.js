//C:\CrowdMailer\frontend\src\components\dashboard\Dashboard.js
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
        const response = await api.get('/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
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
      <Row className="g-4 justify-content-center">
        {[
          { color: 'primary', title: 'Total Subscribers', value: stats.totalSubscribers },
          { color: 'success', title: 'Campaigns Sent', value: stats.campaignsSent },
          { color: 'info', title: 'Emails Sent', value: stats.emailsSent },
          { color: 'warning', title: 'Open Rate', value: `${stats.openRate}%` },
        ].map((item, i) => (
          <Col md={5} key={i}>
            <Card bg={item.color} text="white" className="shadow-lg p-3 rounded-4 text-center">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <h2 className="fw-bold">{item.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default Dashboard;
