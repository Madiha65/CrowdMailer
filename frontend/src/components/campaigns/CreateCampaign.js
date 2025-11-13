// frontend\src\components\campaigns\CreateCampaign.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Form, Button, Container, InputGroup, Badge, Alert, Card } from 'react-bootstrap';
import Editor from '../../components/Editor';

const CreateCampaign = () => {
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    sender: '',
    recipients: []
  });
  // const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [recipientList, setRecipientList] = useState('');
  // const [showRecipientInput, setShowRecipientInput] = useState(false);
  const navigate = useNavigate();

  // Set default sender from logged in user
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setCampaign(prev => ({ ...prev, sender: userEmail }));
    }
  }, []);

  // Update campaign inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampaign(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  // Email handling
  // const handleEmailChange = (e) => setEmailInput(e.target.value);
  
  // const addRecipient = () => {
  //   const emails = emailInput
  //     .split(/[\s,;]+/)
  //     .map(email => email.trim())
  //     .filter(email => email && !campaign.recipients.includes(email));
  //   if (emails.length > 0) {
  //     setCampaign(prev => ({ ...prev, recipients: [...prev.recipients, ...emails] }));
  //     setEmailInput('');
  //   }
  // };
  
  // const removeRecipient = (email) => {
  //   setCampaign(prev => ({ ...prev, recipients: prev.recipients.filter(e => e !== email) }));
  // };

  // // Add recipients from a list (pasted text)
  // const handleRecipientListChange = (e) => {
  //   setRecipientList(e.target.value);
  // };
  
  // const addMultipleRecipients = () => {
  //   const emails = recipientList
  //     .split(/[\s,;]+/)
  //     .map(email => email.trim())
  //     .filter(email => email && !campaign.recipients.includes(email));
  //   if (emails.length > 0) {
  //     setCampaign(prev => ({ ...prev, recipients: [...prev.recipients, ...emails] }));
  //     setRecipientList('');
  //     setShowRecipientInput(false);
  //   }
  // };

  // Subscription fee
  // const calculateFee = () => {
  //   const count = campaign.recipients.length;
  //   if (count <= 50) return 0;
  //   if (count <= 500) return 300;
  //   return 1000;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // if (campaign.recipients.length === 0) {
    //   setError('Please add at least one recipient email');
    //   return;
    // }

    // const fee = calculateFee();
    // if (fee > 0 && !window.confirm(`Your campaign will have a subscription fee of ₹${fee}. Proceed?`)) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", campaign.name);
      formData.append("subject", campaign.subject);
      formData.append("content", campaign.content);
      formData.append("sender", campaign.sender);
      // formData.append("subscriptionFee", fee);
      // formData.append("recipients", JSON.stringify(campaign.recipients));

      await api.post('/campaigns', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      navigate('/campaigns');
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Create Campaign</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Sender Email</Form.Label>
          <Form.Control
            type="email"
            name="sender"
            value={campaign.sender}
            onChange={handleChange}
            required
            placeholder="Your email (must be subscribed)"
          />
          <Form.Text className="text-muted">
            This email must be subscribed and active to send campaigns.
          </Form.Text>
        </Form.Group>

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
        </Form.Group>

        {/* <Card className="mb-3">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Recipients ({campaign.recipients.length})</Card.Title>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowRecipientInput(!showRecipientInput)}
              >
                {showRecipientInput ? 'Hide' : 'Add Multiple'}
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <InputGroup className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={emailInput}
                onChange={handleEmailChange}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRecipient())}
              />
              <Button variant="secondary" onClick={addRecipient}>Add</Button>
            </InputGroup>
            
            {showRecipientInput && (
              <div className="mb-3">
                <Form.Label>Add Multiple Recipients</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Paste multiple email addresses separated by commas, spaces, or new lines"
                  value={recipientList}
                  onChange={handleRecipientListChange}
                />
                <div className="mt-2">
                  <Button variant="primary" onClick={addMultipleRecipients}>
                    Add All Recipients
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="ms-2"
                    onClick={() => {
                      setRecipientList('');
                      setShowRecipientInput(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {campaign.recipients.length > 0 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label>Current Recipients:</Form.Label>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove all recipients?')) {
                        setCampaign(prev => ({ ...prev, recipients: [] }));
                      }
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
              </div>
            )}
          </Card.Body>
        </Card> */}

        {/* <div className="mb-3">
          <strong>Subscription Fee: </strong>
          {calculateFee() === 0 ? 'Free' : `₹${calculateFee()}`}
        </div> */}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCampaign;