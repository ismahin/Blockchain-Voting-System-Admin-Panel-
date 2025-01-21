// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

function AdminSidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    // If not logged in, hide the sidebar (optional design choice)
    return null;
  }

  return (
    <SidebarWrapper>
      <SidebarHeader>My University</SidebarHeader>
      <NavList>
        <StyledNavLink 
          to="/"
          end
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Dashboard
        </StyledNavLink>
        <StyledNavLink 
          to="/clubs"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Clubs
        </StyledNavLink>
        <StyledNavLink 
          to="/candidates"
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Candidates
        </StyledNavLink>
        <StyledNavLink 
  to="/applications"
  className={({ isActive }) => (isActive ? 'active-link' : '')}
>
  Applications
</StyledNavLink>
<StyledNavLink 
  to="/events"
  className={({ isActive }) => (isActive ? 'active-link' : '')}
>
  Events
</StyledNavLink>
      </NavList>
      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </LogoutButton>
    </SidebarWrapper>
  );
}

export default AdminSidebar;

// ====== Styled Components ======
const SidebarWrapper = styled.div`
  width: 240px;
  background-color: #2c3e50;
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  text-align: center;
  font-size: 1.2rem;
  padding: 1rem 0;
  font-weight: bold;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  flex: 1;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.75rem 1rem;
  transition: background 0.2s;
  &.active-link {
    background-color: #34495e;
  }
  &:hover {
    background-color: #34495e;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ecf0f1;
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  &:hover {
    background-color: #34495e;
  }
`;
