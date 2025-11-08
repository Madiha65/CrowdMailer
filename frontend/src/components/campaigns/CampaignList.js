import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Badge, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
import { GrFormViewHide } from "react-icons/gr";
import { MdSendToMobile } from "react-icons/md";


const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSend = async (id) => {
    try {
      await api.post(`/campaigns/${id}/send`);
      alert('Campaign is being sent!');
    
      const response = await api.get('/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
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
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
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
                    onClick={() => handleSend(campaign._id)}
                  >.
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
    </Container>
  );
};

export default CampaignList;