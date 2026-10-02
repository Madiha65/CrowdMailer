// frontend/src/components/subscribers/SubscriberList.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Table, Button, Badge, Container, Card, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const SubscriberList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [subscribers, setSubscribers] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [subs, sub] = await Promise.all([
          api.get('/subscribers'),
          api.get('/subscription/me'),
        ]);
        setSubscribers(subs.data);
        setPlan(sub.data);
      } catch (error) {
        console.error('Error loading subscribers page:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      await api.delete(`/subscribers/${id}`);
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      alert('Failed to delete subscriber');
    }
  };

  const getStatusBadge = (status) =>
    status === 'active'
      ? <Badge bg="success">Active</Badge>
      : <Badge bg="danger">Unsubscribed</Badge>;

  if (loading) return <div>Loading...</div>;

  const unlimited = plan && plan.campaignLimit === null;
  const percent = plan && !unlimited ? Math.min((plan.campaignsSent / plan.campaignLimit) * 100, 100) : 0;

  return (
    <Container>
      {/* ---------- My subscription (plan) ---------- */}
      {plan && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h4 className="mb-1">
                  {isAdmin ? 'Admin (unlimited)' : plan.planName}{' '}
                  <Badge bg={plan.plan === 'free' ? 'secondary' : 'primary'}>
                    {plan.plan.toUpperCase()}
                  </Badge>
                </h4>
                {plan.planExpiresAt && (
                  <small className="text-muted">
                    Renews / expires on {new Date(plan.planExpiresAt).toLocaleDateString()}
                  </small>
                )}
              </div>
              {!isAdmin && plan.plan !== 'pro' && (
                <Button variant="primary" onClick={() => navigate('/pricing')}>
                  {plan.plan === 'free' ? 'Subscribe / Upgrade' : 'Upgrade plan'}
                </Button>
              )}
            </div>

            {!isAdmin && (
              <div className="mt-3">
                <div className="d-flex justify-content-between">
                  <span>Campaigns sent</span>
                  <strong>
                    {plan.campaignsSent} / {unlimited ? '∞' : plan.campaignLimit}
                  </strong>
                </div>
                {!unlimited && (
                  <ProgressBar
                    now={percent}
                    variant={percent >= 100 ? 'danger' : percent >= 80 ? 'warning' : 'success'}
                    className="mt-1"
                  />
                )}
                {plan.remaining === 0 && (
                  <div className="text-danger mt-2">
                    Limit reached. Subscribe to a paid plan to send more campaigns.
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* ---------- Subscriber (mailing list) ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Subscribers</h1>
        <Link to="/subscribers/add" className="btn btn-primary">
          Add Subscriber
        </Link>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {isAdmin && <th>Owner</th>}
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 6 : 5} className="text-center text-muted">
                No subscribers yet. Click "Add Subscriber" to add one.
              </td>
            </tr>
          )}
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              {isAdmin && <td>{s.owner?.email || '-'}</td>}
              <td>{getStatusBadge(s.status)}</td>
              <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(s._id)}>
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

export default SubscriberList;
