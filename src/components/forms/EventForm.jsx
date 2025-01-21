// src/components/forms/EventForm.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

function EventForm({ clubs, onSubmitEvent, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;

    onSubmitEvent({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      clubIds: selectedClubs.map(Number),
    });

    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setSelectedClubs([]);
  };

  const toggleClubSelection = (clubId) => {
    if (selectedClubs.includes(clubId)) {
      setSelectedClubs(selectedClubs.filter((id) => id !== clubId));
    } else {
      setSelectedClubs([...selectedClubs, clubId]);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Label>Event Name:</Label>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Label>Description:</Label>
      <TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Label>Start Date:</Label>
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <Label>End Date:</Label>
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <Label>Clubs Participating:</Label>
      <ClubList>
        {clubs.map((club) => (
          <ClubItem key={club.id}>
            <input
              type="checkbox"
              id={`club-${club.id}`}
              checked={selectedClubs.includes(club.id)}
              onChange={() => toggleClubSelection(club.id)}
            />
            <label htmlFor={`club-${club.id}`}>{club.name}</label>
          </ClubItem>
        ))}
      </ClubList>

      <ButtonRow>
        <SubmitButton type="submit">Save</SubmitButton>
        {onCancel && <CancelButton onClick={onCancel}>Cancel</CancelButton>}
      </ButtonRow>
    </FormContainer>
  );
}

export default EventForm;

// ====== Styled Components ======
const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  height: 60px;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ClubList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ClubItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  background-color: #2980b9;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #bdc3c7;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
