// src/pages/Clubs/Clubs.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ClubForm from '../../components/forms/ClubForm';
import EditClubModal from './EditClubModal';

// Mock API
import {
  getAllClubs,
  createClub,
  deleteClub,
} from '../../services/mockApi';

function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [editClubId, setEditClubId] = useState(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const data = await getAllClubs();
    setClubs(data);
  };

  const handleAddClub = async (clubData) => {
    await createClub(clubData);
    fetchClubs();
  };

  const handleDeleteClub = async (id) => {
    await deleteClub(id);
    fetchClubs();
  };

  return (
    <ClubsContainer>
      <h2>Manage Clubs</h2>
      
      <ClubForm onAddClub={handleAddClub} />

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Club Name</th>
            <th>Positions</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((club) => (
            <tr key={club.id}>
              <td>{club.id}</td>
              <td>
                <strong>{club.name}</strong>
                <Desc>{club.description}</Desc>
              </td>
              <td>
                {club.positions.length > 0 ? (
                  <ul>
                    {club.positions.map((pos, idx) => (
                      <li key={idx}>{pos}</li>
                    ))}
                  </ul>
                ) : (
                  <em>No positions listed</em>
                )}
              </td>
              <td>{club.isActive ? 'Active' : 'Inactive'}</td>
              <td style={{ textAlign: 'right' }}>
                <ActionButton onClick={() => setEditClubId(club.id)}>
                  Edit
                </ActionButton>
                <DeleteButton onClick={() => handleDeleteClub(club.id)}>
                  Delete
                </DeleteButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editClubId && (
        <EditClubModal
          clubId={editClubId}
          onClose={() => {
            setEditClubId(null);
            fetchClubs();
          }}
        />
      )}
    </ClubsContainer>
  );
}

export default Clubs;

// ====== Styled Components ======
const ClubsContainer = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);

  thead {
    background-color: #2980b9;
    color: #fff;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: top;
  }

  tr:not(:last-child) td {
    border-bottom: 1px solid #ddd;
  }
`;

const Desc = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const ActionButton = styled.button`
  margin-right: 0.5rem;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.75rem;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled.button`
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
