// src/components/forms/EventForm.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  getAllCandidates, // if we need to load them here
} from '../../services/mockApi';

/**
 * props:
 * - clubs: array of all clubs
 * - onSubmitEvent: function to call when form is submitted
 * - onCancel: optional, to hide form
 */
function EventForm({ clubs, onSubmitEvent, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // lineItems = [ { clubId, position, candidateIds: [] }, ... ]
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const candData = await getAllCandidates();
    setCandidates(candData);
  };

  // Toggle a club in selectedClubs
  const toggleClubSelection = (clubId) => {
    if (selectedClubs.includes(clubId)) {
      setSelectedClubs(selectedClubs.filter((id) => id !== clubId));
      // Also remove lineItems that belong to this club
      setLineItems(lineItems.filter((li) => li.clubId !== clubId));
    } else {
      setSelectedClubs([...selectedClubs, clubId]);
    }
  };

  // Called when admin clicks "Add Position" for a given club
  const addPositionLineItem = (clubId) => {
    setLineItems([
      ...lineItems,
      {
        clubId,
        position: '', // admin picks later
        candidateIds: [],
      },
    ]);
  };

  // Update a line item’s position
  const handleChangePosition = (index, newPosition) => {
    const updated = [...lineItems];
    updated[index].position = newPosition;
    // Also clear candidateIds since the position changed
    updated[index].candidateIds = [];
    setLineItems(updated);
  };

  // Toggle candidate selection inside a line item
  const toggleCandidate = (lineIndex, candidateId) => {
    const updated = [...lineItems];
    const { candidateIds } = updated[lineIndex];
    if (candidateIds.includes(candidateId)) {
      updated[lineIndex].candidateIds = candidateIds.filter((id) => id !== candidateId);
    } else {
      updated[lineIndex].candidateIds = [...candidateIds, candidateId];
    }
    setLineItems(updated);
  };

  // Remove line item
  const removeLineItem = (index) => {
    const updated = [...lineItems];
    updated.splice(index, 1);
    setLineItems(updated);
  };

  // Filter candidates to only those that match the lineItem’s clubId + position
  const getCandidateOptions = (clubId, position) => {
    return candidates.filter((cand) => {
      return cand.clubId === clubId && cand.position === position;
    });
  };

  // Handle final form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;

    onSubmitEvent({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      lineItems,
    });

    // Clear fields
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setSelectedClubs([]);
    setLineItems([]);
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

      <SectionTitle>Select Clubs Participating:</SectionTitle>
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

      {/* For each selected club, let admin add positions and candidates */}
      {selectedClubs.map((clubId) => {
        const club = clubs.find((c) => c.id === clubId);
        if (!club) return null;
        return (
          <PositionsSection key={clubId}>
            <h4>{club.name}</h4>
            <AddPositionButton onClick={(e) => {
              e.preventDefault();
              addPositionLineItem(clubId);
            }}>
              + Add Position
            </AddPositionButton>

            {/* Show lineItems for this club */}
            {lineItems
              .map((li, idx) => ({ li, idx }))
              .filter(({ li }) => li.clubId === clubId)
              .map(({ li, idx }) => (
                <PositionRow key={idx}>
                  <PositionSelect
                    value={li.position}
                    onChange={(e) => handleChangePosition(idx, e.target.value)}
                  >
                    <option value="">Select Position</option>
                    {club.positions.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </PositionSelect>

                  {/* Show candidate checkboxes for the chosen position */}
                  {li.position && (
                    <CandidateList>
                      {getCandidateOptions(clubId, li.position).map((cand) => (
                        <CandidateItem key={cand.id}>
                          <input
                            type="checkbox"
                            id={`cand-${cand.id}`}
                            checked={li.candidateIds.includes(cand.id)}
                            onChange={() => toggleCandidate(idx, cand.id)}
                          />
                          <label htmlFor={`cand-${cand.id}`}>{cand.name}</label>
                        </CandidateItem>
                      ))}
                      {getCandidateOptions(clubId, li.position).length === 0 && (
                        <NoCandidates>No approved candidates for {li.position} yet.</NoCandidates>
                      )}
                    </CandidateList>
                  )}

                  <RemoveButton onClick={() => removeLineItem(idx)}>Remove</RemoveButton>
                </PositionRow>
              ))}
          </PositionsSection>
        );
      })}

      <ButtonRow>
        <SubmitButton type="submit">Save</SubmitButton>
        {onCancel && (
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
        )}
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

const SectionTitle = styled.div`
  margin-top: 1rem;
  font-weight: bold;
  color: #2c3e50;
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

const PositionsSection = styled.div`
  margin: 1rem 0;
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 6px;

  h4 {
    margin: 0;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }
`;

const AddPositionButton = styled.button`
  background-color: #27ae60;
  color: #fff;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background-color: #2ecc71;
  }
`;

const PositionRow = styled.div`
  background-color: #fff;
  padding: 0.5rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
`;

const PositionSelect = styled.select`
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const CandidateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const CandidateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const NoCandidates = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
`;

const RemoveButton = styled.button`
  background-color: #e67e22;
  color: #fff;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover {
    background-color: #d35400;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
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
