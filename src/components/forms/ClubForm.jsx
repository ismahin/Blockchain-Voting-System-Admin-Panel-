// src/components/forms/ClubForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

function ClubForm({ onAddClub }) {
  const [clubName, setClubName] = useState('');
  const [description, setDescription] = useState('');
  const [positionsText, setPositionsText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clubName.trim()) return;
    // Convert positions from a comma-separated string to an array
    const positionsArray = positionsText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    onAddClub({
      name: clubName.trim(),
      description: description.trim(),
      positions: positionsArray,
    });

    // Clear fields
    setClubName('');
    setDescription('');
    setPositionsText('');
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>Club Name:</Label>
      <Input
        type="text"
        placeholder="Enter Club Name"
        value={clubName}
        onChange={(e) => setClubName(e.target.value)}
      />

      <Label>Description:</Label>
      <TextArea
        placeholder="Describe this club..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Label>Positions (comma-separated):</Label>
      <Input
        type="text"
        placeholder="e.g. President, Vice President, Secretary"
        value={positionsText}
        onChange={(e) => setPositionsText(e.target.value)}
      />

      <AddButton type="submit">Add Club</AddButton>
    </FormContainer>
  );
}

export default ClubForm;

// ====== Styled Components ======
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  gap: 0.5rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  resize: none;
  height: 60px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddButton = styled.button`
  background-color: #2980b9;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background-color: #3498db;
  }
`;
