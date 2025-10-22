import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Form, Button, Container, InputGroup, Badge } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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

  // Update content from WYSIWYG editor
  const handleContentChange = (event, editor) => {
    const data = editor.getData();
    setCampaign(prev => ({ ...prev, content: data }));
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

  // Submit
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
      await api.post('/campaigns', { ...campaign, subscriptionFee: fee });
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

          {/* CKEditor WYSIWYG Editor */}
          <CKEditor
            editor={ClassicEditor}
            data={campaign.content}
            onChange={handleContentChange}
            config={{
              toolbar: [
                'heading', '|',
                'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                'insertTable', 'mediaEmbed', 'undo', 'redo', 'imageUpload'
              ],
              mediaEmbed: {
                previewsInData: true
              },
              ckfinder: {
                // Base64 uploader (uploads images, PDFs, videos directly into HTML)
                uploadUrl: ''
              }
            }}
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
