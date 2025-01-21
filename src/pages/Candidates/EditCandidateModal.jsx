// src/pages/Candidates/EditCandidateModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllCandidates, updateCandidate } from '../../services/mockApi';

function EditCandidateModal({ candidateId, clubs, onClose }) {
  const [candidate, setCandidate] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [selectedClub, setSelectedClub] = useState('');

  useEffect(() => {
    loadCandidateData();
    // eslint-disable-next-line
  }, []);

  const loadCandidateData = async () => {
    const allCandidates = await getAllCandidates();
    const target = allCandidates.find((cand) => cand.id === candidateId);
    if (target) {
      setCandidate(target);
      setCandidateName(target.name);
      setSelectedClub(String(target.clubId));
    }
  };

  const handleSave = async () => {
    await updateCandidate(candidateId, {
      name: candidateName,
      clubId: Number(selectedClub),
    });
    onClose();
  };

  if (!candidate) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <h3>Edit Candidate</h3>

        <Label>Candidate Name:</Label>
        <Input
          type="text"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <Label>Club:</Label>
        <Select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
        >
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </Select>

        <ButtonRow>
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default EditCandidateModal;

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
  width: 400px;
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
