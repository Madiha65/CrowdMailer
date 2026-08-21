// frontend/src/components/auth/Register.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect');
  const plan = params.get('plan');
const isValidEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(email);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isValidEmail(email)) {
    toast.error('Invalid email format. Use example@gmail.com ❌');
    return;
  }

  if (password !== confirmPassword) {
    toast.error('Password and Confirm Password do not match ❌');
    return;
  }

  try {
    await register({ name, email, password });

    toast.success('Registration successful 🎉 Please login');

  navigate('/login');

  } catch (err) {
    toast.error('Email already exists ❌');
  }
};

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="w-100">
              Register
            </Button>
          </Form>

          <div className="text-center mt-3">
            Already have an account?{' '}
            <a href={`/login?redirect=${redirect}&plan=${plan}`}>Login</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
