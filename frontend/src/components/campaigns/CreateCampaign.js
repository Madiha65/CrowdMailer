import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Form, Button, Container, InputGroup, Badge } from 'react-bootstrap';

import Editor from '../../components/Editor';
const CreateCampaign = () => {
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: []
  });
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update campaign inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
  };

  // Email handling
  const handleEmailChange = (e) => setEmailInput(e.target.value);
  const addRecipient = () => {
    const emails = emailInput
      .split(/[\s,;]+/)
      .map(email => email.trim())
      .filter(email => email && !campaign.recipients.includes(email));
    if (emails.length > 0) {
      setCampaign(prev => ({ ...prev, recipients: [...prev.recipients, ...emails] }));
      setEmailInput('');
    }
  };
  const removeRecipient = (email) => {
    setCampaign(prev => ({ ...prev, recipients: prev.recipients.filter(e => e !== email) }));
  };

  // Subscription fee
  const calculateFee = () => {
    const count = campaign.recipients.length;
    if (count <= 50) return 0;
    if (count <= 500) return 300;
    return 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (campaign.recipients.length === 0) {
      alert('Please add at least one recipient email');
      return;
    }

    const fee = calculateFee();
    if (fee > 0 && !window.confirm(`Your campaign will have a subscription fee of ₹${fee}. Proceed?`)) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", campaign.name);
      formData.append("subject", campaign.subject);
      formData.append("content", campaign.content);
      formData.append("subscriptionFee", fee);
      formData.append("recipients", JSON.stringify(campaign.recipients));

      await api.post('/campaigns', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Create Campaign</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={campaign.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={campaign.subject}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content (HTML)</Form.Label>
          <Editor
    data={campaign.content}
    onChange={data => setCampaign(prev => ({ ...prev, content: data }))}
  />

          {/* Recipients Input */}
          <InputGroup className="my-3">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <Button variant="secondary" onClick={addRecipient}>Add</Button>
          </InputGroup>

          <div>
            {campaign.recipients.map((email, index) => (
              <Badge
                key={index}
                bg="info"
                className="me-2 mb-2"
                style={{ cursor: 'pointer' }}
                onClick={() => removeRecipient(email)}
              >
                {email} &times;
              </Badge>
            ))}
          </div>
          <Form.Text className="text-muted">
            Click on email badge to remove it.
          </Form.Text>
        </Form.Group>

        <div className="mb-3">
          <strong>Subscription Fee: </strong>
          {calculateFee() === 0 ? 'Free' : `₹${calculateFee()}`}
        </div>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCampaign;
