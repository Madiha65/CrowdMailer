//C:\Users\Msoom Ali\Desktop\CrowdMailer\frontend\src\components\campaigns\CampaignReport.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, Row, Col, Container, Badge, ListGroup } from 'react-bootstrap';


const CampaignReport = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await api.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError(err.response?.data?.message || 'Could not load campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !campaign) return <Container><p className="text-danger">{error || 'Campaign not found'}</p><Link to="/campaigns">Back</Link></Container>;

  const recipients = campaign.recipients || [];
  const isSent = campaign.status === 'sent';
  const delivered = isSent ? (campaign.sentCount || 0) : 0;
  const failed = isSent ? Math.max(recipients.length - delivered, 0) : 0;

  const cards = [
    { bg: 'secondary', title: 'Recipients', value: recipients.length },
    { bg: 'success', title: 'Delivered', value: isSent ? delivered : '-' },
    { bg: 'danger', title: 'Failed', value: isSent ? failed : '-' },
    { bg: 'primary', title: 'Status', value: campaign.status },
  ];


  return (
    <Container>
      <Link to="/campaigns" className="btn btn-sm btn-outline-secondary mb-3">← Back</Link>
      <h1 className="mb-4">Campaign Report: {campaign.name}</h1>
      <p className="text-muted mb-4">
        Subject: <strong>{campaign.subject}</strong><br />
        Sender: {campaign.sender || '-'}
        {campaign.sentAt && <> · Sent on {new Date(campaign.sentAt).toLocaleString()}</>}
      </p>

      <Row className="mb-4 g-3">
        {cards.map((c) => (
          <Col md={3} key={c.title}>
            <Card bg={c.bg} text="white">
              <Card.Body>
                <Card.Title>{c.title}</Card.Title>
                <h2 style={{ textTransform: 'capitalize' }}>{c.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-4">
        <Card.Header><h5 className="mb-0">Recipients ({recipients.length})</h5></Card.Header>
        <ListGroup variant="flush" style={{ maxHeight: 220, overflowY: 'auto' }}>
          {recipients.map((email) => (
            <ListGroup.Item key={email}>{email}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Card className="mb-4">
        <Card.Header><h5 className="mb-0">Content Preview</h5></Card.Header>
        <Card.Body>
          {/* sandboxed iframe: scripts in campaign HTML cannot run (safe for admin viewing user content) */}
          <iframe
            title="preview"
            sandbox=""
            srcDoc={campaign.content || '<p>No content</p>'}
            style={{ width: '100%', minHeight: 300, border: '1px solid #dee2e6', borderRadius: 6 }}
          />
        </Card.Body>
      </Card>

      <small className="text-muted">
        Open / click tracking is not enabled yet, so those numbers are not shown.
      </small>
    </Container>
  );
};

export default CampaignReport;