// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';
import { FaUserShield } from 'react-icons/fa';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password!');
    }
  };

  return (
    <LoginContainer>
      <LoginCard onSubmit={handleSubmit}>
        <IconWrapper>
          <FaUserShield size={50} />
        </IconWrapper>
        <h2>Admin Login</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <ErrorText>{error}</ErrorText>}
        <LoginButton type="submit">Log In</LoginButton>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;

// ====== Styled Components ======
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #ecf0f1;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled.form`
  background-color: #fff;
  padding: 2rem;
  width: 320px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  color: #2980b9;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.25rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const LoginButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  background-color: #2980b9;
  color: #fff;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #3498db;
  }
`;
