// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { AuthProvider } from './context/AuthContext';

// Components
import AdminSidebar from './components/admin/AdminSidebar';
import AdminHeader from './components/admin/AdminHeader';

// Routes
import AdminRoutes from './routes/AdminRoutes';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Login from './pages/Auth/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContainer>
          {/* Sidebar: only show if authenticated (optional design choice) */}
          <AdminSidebar />
          <MainContainer>
            <AdminHeader />
            <ContentWrapper>
              <Routes>
                {/* Public Route for Login */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AdminRoutes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </ContentWrapper>
          </MainContainer>
        </AppContainer>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

// ====== Styled Components ======
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ecf0f1;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;
