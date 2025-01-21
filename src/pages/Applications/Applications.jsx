// src/pages/Applications/Applications.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  getAllApplications,
  getAllClubs,
  updateApplication,
  createCandidate,
} from '../../services/mockApi';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [apps, clubData] = await Promise.all([
      getAllApplications(),
      getAllClubs(),
    ]);
    setApplications(apps);
    setClubs(clubData);
  };

  const handleApprove = async (appId) => {
    // Find the application
    const app = applications.find((a) => a.id === appId);
    if (!app) return;

    // Create new candidate
    await createCandidate({
      name: app.name,
      clubId: app.clubId,
      position: app.position,
    });

    // Update the application's status
    await updateApplication(appId, { status: 'approved' });
    fetchData();
  };

  const handleReject = async (appId) => {
    // Mark the application as rejected
    await updateApplication(appId, { status: 'rejected' });
    fetchData();
  };

  const getClubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : 'N/A';
  };

  // We’ll display all applications, but highlight pending ones
  return (
    <Container>
      <h2>Candidate Applications</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Candidate Name</th>
            <th>Club</th>
            <th>Position</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.name}</td>
              <td>{getClubName(app.clubId)}</td>
              <td>{app.position}</td>
              <td>
                {app.status === 'pending' && (
                  <PendingBadge>Pending</PendingBadge>
                )}
                {app.status === 'approved' && (
                  <ApprovedBadge>Approved</ApprovedBadge>
                )}
                {app.status === 'rejected' && (
                  <RejectedBadge>Rejected</RejectedBadge>
                )}
              </td>
              <td style={{ textAlign: 'right' }}>
                {app.status === 'pending' && (
                  <>
                    <ActionButton onClick={() => handleApprove(app.id)}>
                      Approve
                    </ActionButton>
                    <RejectButton onClick={() => handleReject(app.id)}>
                      Reject
                    </RejectButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Applications;

// ====== Styled Components ======
const Container = styled.div`
  display: flex;
  flex-direction: column;
  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);

  thead {
    background-color: #2980b9;
    color: #fff;
  }
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: middle;
  }
  tr:not(:last-child) td {
    border-bottom: 1px solid #ddd;
  }
`;

const PendingBadge = styled.span`
  color: #f39c12;
  font-weight: bold;
`;

const ApprovedBadge = styled.span`
  color: #27ae60;
  font-weight: bold;
`;

const RejectedBadge = styled.span`
  color: #c0392b;
  font-weight: bold;
`;

const ActionButton = styled.button`
  margin-right: 0.5rem;
  background-color: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #2ecc71;
  }
`;

const RejectButton = styled.button`
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;
