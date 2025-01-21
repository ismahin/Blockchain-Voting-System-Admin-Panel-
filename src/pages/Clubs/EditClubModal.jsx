// src/pages/Clubs/EditClubModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllClubs, updateClub } from '../../services/mockApi';

function EditClubModal({ clubId, onClose }) {
  const [club, setClub] = useState(null);
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [positionsText, setPositionsText] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadClubData();
    // eslint-disable-next-line
  }, []);

  const loadClubData = async () => {
    const data = await getAllClubs();
    const targetClub = data.find((c) => c.id === clubId);
    if (targetClub) {
      setClub(targetClub);
      setClubName(targetClub.name);
      setDescription(targetClub.description);
      setPositionsText(targetClub.positions.join(', '));
      setIsActive(targetClub.isActive);
    }
  };

  const handleSave = async () => {
    const updatedPositions = positionsText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    await updateClub(clubId, {
      name: clubName,
      description,
      positions: updatedPositions,
      isActive,
    });
    onClose();
  };

  if (!club) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <h3>Edit Club</h3>

        <Label>Name:</Label>
        <Input
          type="text"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />

        <Label>Description:</Label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Label>Positions (comma-separated):</Label>
        <Input
          type="text"
          value={positionsText}
          onChange={(e) => setPositionsText(e.target.value)}
        />

        <Label>Status:</Label>
        <Select
          value={isActive ? 'active' : 'inactive'}
          onChange={(e) => setIsActive(e.target.value === 'active')}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <ButtonRow>
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default EditClubModal;

// ====== Styled Components ======
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 1.5rem;
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
`;

const Label = styled.label`
  margin-top: 0.75rem;
  display: block;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  height: 60px;
`;

const Select = styled.select`
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background-color: #2980b9;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #bdc3c7;
  border: none;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;
