
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { Card, Row, Col, Container } from 'react-bootstrap';

const CampaignReport = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!campaign) return <div>Campaign not found</div>;

  return (
    <Container>
      <h1 className="mb-4">Campaign Report: {campaign.name}</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title>Total Sent</Card.Title>
              <h2>{campaign.stats.totalSent}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white">
            <Card.Body>
              <Card.Title>Opened</Card.Title>
              <h2>{campaign.stats.opened}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="info" text="white">
            <Card.Body>
              <Card.Title>Clicked</Card.Title>
              <h2>{campaign.stats.clicked}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="danger" text="white">
            <Card.Body>
              <Card.Title>Bounced</Card.Title>
              <h2>{campaign.stats.bounced}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Card>
        <Card.Header>
          <h5>Content Preview</h5>
        </Card.Header>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: campaign.content }} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CampaignReport;