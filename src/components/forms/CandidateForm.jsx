// src/components/forms/CandidateForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { createCandidate } from '../../services/mockApi';

function CandidateForm({ clubs, onAddCandidate }) {
  const [candidateName, setCandidateName] = useState('');
  const [selectedClub, setSelectedClub] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!candidateName.trim() || !selectedClub) return;

    await createCandidate(candidateName.trim(), Number(selectedClub));
    setCandidateName('');
    setSelectedClub('');
    onAddCandidate(); // refresh candidates
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
      />

      <Select
        value={selectedClub}
        onChange={(e) => setSelectedClub(e.target.value)}
      >
        <option value="">Select Club</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </Select>

      <AddButton type="submit">Add Candidate</AddButton>
    </FormContainer>
  );
}

export default CandidateForm;

// ====== Styled Components ======
const FormContainer = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddButton = styled.button`
  background-color: #27ae60;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2ecc71;
  }
`;
