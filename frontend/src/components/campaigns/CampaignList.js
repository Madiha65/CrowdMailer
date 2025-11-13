// frontend\src\components\campaigns\CampaignList.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Badge, Container, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";
import { MdSendToMobile } from "react-icons/md";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [customRecipients, setCustomRecipients] = useState('');
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSendClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowSendModal(true);
  };

  const handleSend = async () => {
    if (!selectedCampaign) return;
    
    setSendLoading(true);
    try {
      // Prepare recipients
      let recipients = [];
      
      // If custom recipients are provided, use them
      if (customRecipients.trim()) {
        recipients = customRecipients.split(/[\s,;]+/).map(email => email.trim()).filter(email => email);
      } 
      // Otherwise use the campaign's default recipients
      else if (selectedCampaign.recipients && selectedCampaign.recipients.length > 0) {
        recipients = selectedCampaign.recipients;
      }
      
      if (recipients.length === 0) {
        alert("Please add at least one recipient");
        setSendLoading(false);
        return;
      }

      await api.post(
        `/campaigns/${selectedCampaign._id}/send`,
        { recipients }, // Send recipients in the request body
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("✅ Campaign is being sent!");
      setShowSendModal(false);
      setCustomRecipients('');
      
      // Refresh the list
      const response = await api.get("/campaigns");
      setCampaigns(response.data);
    } catch (error) {
      console.error("❌ Error sending campaign:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to send campaign");
    } finally {
      setSendLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft': return <Badge bg="secondary">Draft</Badge>;
      case 'sending': return <Badge bg="warning">Sending</Badge>;
      case 'sent': return <Badge bg="success">Sent</Badge>;
      case 'paused': return <Badge bg="danger">Paused</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) return <div>Loading...</div>;
  
  const handleDelete = async (id) => {
    console.log("🗑️ Attempting to delete campaign ID:", id);  

    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const response = await api.delete(`/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      console.log("✅ Delete response:", response.data); 
      alert("Campaign deleted successfully!");

      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error("❌ Error deleting campaign:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      }
      alert("Failed to delete campaign");
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campaigns</h1>
        <Link to="/campaigns/create" className="btn btn-primary">
          Create Campaign
        </Link>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sender</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
              <td>{campaign.sender}</td>
              <td>{getStatusBadge(campaign.status)}</td>
              <td>{new Date(campaign.createdAt).toLocaleDateString()}</td>
              <td>
                <Link to={`/campaigns/${campaign._id}`} className="btn btn-sm btn-info me-2">
                  <GrFormViewHide />
                </Link>
                {campaign.status === 'draft' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSendClick(campaign)}
                    className="me-2"
                  >
                    <MdSendToMobile />
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(campaign._id)}
                >
                  <RiDeleteBinLine />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Send Campaign Modal */}
      <Modal show={showSendModal} onHide={() => setShowSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Campaign: {selectedCampaign?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Sender:</strong> {selectedCampaign?.sender}
          </p>
          {/* <p>
            <strong>Default Recipients:</strong> {selectedCampaign?.recipients?.join(', ') || 'None'}
          </p> */}
          <Form.Group>
            <Form.Label>Custom Recipients (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter email addresses separated by commas (leave empty to use default recipients)"
              value={customRecipients}
              onChange={(e) => setCustomRecipients(e.target.value)}
            />
            <Form.Text className="text-muted">
              Leave empty to use the default recipients, or enter custom email addresses separated by commas.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} disabled={sendLoading}>
            {sendLoading ? 'Sending...' : 'Send Campaign'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CampaignList;