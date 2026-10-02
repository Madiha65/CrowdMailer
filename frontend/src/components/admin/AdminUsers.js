// frontend/src/components/admin/AdminUsers.js
import React, { useEffect, useState } from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error('Error loading users:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Container>
            <h1 className="mb-4">All Users</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th><th>Email</th><th>Role</th><th>Plan</th>
                        <th>Campaigns Sent</th><th>Plan Expires</th><th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td><Badge bg={u.plan === 'free' ? 'secondary' : 'primary'}>{u.plan}</Badge></td>
                            <td>{u.campaignsSent}</td>
                            <td>{u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString() : '-'}</td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminUsers;
