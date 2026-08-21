// frontend/src/components/auth/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
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

    try {
      await login(email, password);

      toast.success('Login successful 🎉');
      navigate(redirect || '/');

    } catch (err) {
      const message = err?.response?.data?.message;

      if (message === 'User not found') {
        toast.error('Email not found ❌');
      } else if (message === 'Invalid password') {
        toast.error('Incorrect password ❌');
      } else {
        toast.error('Login failed ❌');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>

          <Form onSubmit={handleSubmit}>
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

            <Button type="submit" className="w-100">
              Login
            </Button>
          </Form>

          <div className="text-center mt-3">
            Don't have an account?{' '}
            <a href={`/register?redirect=${redirect}&plan=${plan}`}>Register</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
