import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Form, Button, Container, InputGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import Editor from '../../components/Editor';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: [],
  });

  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => setEmailInput(e.target.value);

  const addRecipient = () => {
    const emails = emailInput
      .split(/[\s,;]+/)
      .map((email) => email.trim())
      .filter((email) => email && !campaign.recipients.includes(email));

    if (emails.length > 0) {
      setCampaign((prev) => ({
        ...prev,
        recipients: [...prev.recipients, ...emails],
      }));
      setEmailInput('');
    }
  };

  const removeRecipient = (email) => {
    setCampaign((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((e) => e !== email),
    }));
  };

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

    if (fee > 0 && !window.confirm(`Your campaign will have a subscription fee of ₹${fee}. Proceed?`)) {
      return;
    }

    setLoading(true);

    // ────────────────────────────────────────────────
    // Clean payload – remove sender (backend uses req.user.email now)
    const payload = {
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      subscriptionFee: fee,
      recipients: campaign.recipients,
      // sender: userEmail, // Validated by token in backend
    };

    try {
      await api.post('/campaigns', payload);   // no need to repeat headers – your api.js interceptor adds token

      alert('Campaign created successfully!');
      navigate('/campaigns');
    } catch (error) {
      console.error('Create campaign failed:', error);

      let msg = 'Failed to create campaign';

      if (error.response) {
        if (error.response.status === 400) {
          // Show the real backend message
          msg = error.response.data?.error
            || error.response.data?.message
            || 'Bad request – check the fields';
        } else if (error.response.status === 403) {
          msg = 'Permission denied – check your subscription status';
        } else if (error.response.status === 401) {
          msg = 'Please log in again';
        }
      }

      alert(msg);
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
            onChange={(data) =>
              setCampaign((prev) => ({ ...prev, content: data }))
            }
          />
        </Form.Group>

        {/* Recipients */}
        <Form.Group className="mb-3">
          <Form.Label>Audience</Form.Label>
          <InputGroup className="my-3">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={emailInput}
              onChange={handleEmailChange}
            />
            <Button variant="secondary" onClick={addRecipient}>
              Add
            </Button>
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
                {email} ×
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