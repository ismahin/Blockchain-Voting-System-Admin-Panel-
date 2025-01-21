// src/components/admin/AdminHeader.jsx
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

function AdminHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <HeaderContainer>
      <LogoArea>Admin Panel</LogoArea>
      {isAuthenticated && <WelcomeText>Welcome, Admin!</WelcomeText>}
    </HeaderContainer>
  );
}

export default AdminHeader;

// ====== Styled Components ======
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  height: 60px;
  padding: 0 1rem;
  border-bottom: 1px solid #ddd;
`;

const LogoArea = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const WelcomeText = styled.div`
  font-size: 1rem;
  color: #2c3e50;
`;
