// src/pages/Events/EditEventModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getAllEvents,
  getAllClubs,
  getAllCandidates,
  updateEvent,
} from '../../services/mockApi';

function EditEventModal({ eventId, onClose }) {
  const [eventData, setEventData] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lineItems, setLineItems] = useState([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const loadData = async () => {
    const [allEvts, clubList, candList] = await Promise.all([
      getAllEvents(),
      getAllClubs(),
      getAllCandidates(),
    ]);
    setClubs(clubList);
    setCandidates(candList);

    const evt = allEvts.find((e) => e.id === eventId);
    if (evt) {
      setEventData(evt);
      setName(evt.name);
      setDescription(evt.description);
      setStartDate(evt.startDate);
      setEndDate(evt.endDate);
      setLineItems(evt.lineItems || []);
    }
  };

  const handleSave = async () => {
    await updateEvent(eventId, {
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      lineItems,
    });
    onClose();
  };

  // Helper to get club for a line item
  const getClub = (clubId) => clubs.find((c) => c.id === clubId);

  // Toggle candidate
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

  // Change position
  const handleChangePosition = (index, newPos) => {
    const updated = [...lineItems];
    updated[index].position = newPos;
    updated[index].candidateIds = []; // clear selected candidates
    setLineItems(updated);
  };

  // Remove line item
  const removeLineItem = (idx) => {
    const updated = [...lineItems];
    updated.splice(idx, 1);
    setLineItems(updated);
  };

  // Add line item for a club
  const addLineItem = (clubId) => {
    setLineItems([
      ...lineItems,
      { clubId, position: '', candidateIds: [] },
    ]);
  };

  // Candidate options that match the line item
  const getCandidateOptions = (clubId, position) => {
    return candidates.filter((cand) => {
      return cand.clubId === clubId && cand.position === position;
    });
  };

  if (!eventData) return null;

  // Compute selected clubs from lineItems
  const selectedClubIds = Array.from(new Set(lineItems.map((li) => li.clubId)));

  return (
    <Overlay>
      <ModalContainer>
        <h3>Edit Event</h3>
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

        {/* Show which clubs are involved based on lineItems */}
        <SectionTitle>Selected Clubs / Positions</SectionTitle>
        {clubs.map((club) => {
          if (!selectedClubIds.includes(club.id)) {
            return (
              <ClubRow key={club.id}>
                <ClubName>{club.name}</ClubName>
                <SmallButton onClick={() => addLineItem(club.id)}>
                  + Add
                </SmallButton>
              </ClubRow>
            );
          } else {
            return (
              <PositionsSection key={club.id}>
                <ClubName>{club.name}</ClubName>
                {lineItems
                  .map((li, idx) => ({ li, idx }))
                  .filter(({ li }) => li.clubId === club.id)
                  .map(({ li, idx }) => (
                    <PositionRow key={idx}>
                      <PositionSelect
                        value={li.position}
                        onChange={(e) => handleChangePosition(idx, e.target.value)}
                      >
                        <option value="">Select Position</option>
                        {club.positions.map((pos) => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </PositionSelect>

                      {li.position && (
                        <CandidateList>
                          {getCandidateOptions(club.id, li.position).map((cand) => (
                            <CandidateItem key={cand.id}>
                              <input
                                type="checkbox"
                                checked={li.candidateIds.includes(cand.id)}
                                onChange={() => toggleCandidate(idx, cand.id)}
                              />
                              <span>{cand.name}</span>
                            </CandidateItem>
                          ))}
                          {getCandidateOptions(club.id, li.position).length === 0 && (
                            <NoCandidates>No approved candidates for {li.position}.</NoCandidates>
                          )}
                        </CandidateList>
                      )}

                      <RemoveButton onClick={() => removeLineItem(idx)}>Remove</RemoveButton>
                    </PositionRow>
                  ))
                }
                <SmallButton onClick={() => addLineItem(club.id)}>
                  + Add Position
                </SmallButton>
              </PositionsSection>
            );
          }
        })}

        <ButtonRow>
          <SaveButton onClick={handleSave}>Save</SaveButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
}

export default EditEventModal;

// ====== Styled Components ======
const Overlay = styled.div`
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
  width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);

  h3 {
    margin-top: 0;
    color: #2c3e50;
  }
`;

const Label = styled.label`
  display: block;
  margin-top: 0.75rem;
  font-weight: 500;
  color: #2c3e50;
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
  height: 60px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SectionTitle = styled.div`
  margin-top: 1rem;
  font-weight: bold;
  color: #2c3e50;
`;

const ClubRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ecf0f1;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 6px;
`;

const ClubName = styled.div`
  font-weight: bold;
`;

const SmallButton = styled.button`
  background-color: #27ae60;
  color: #fff;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  &:hover {
    background-color: #2ecc71;
  }
`;

const PositionsSection = styled.div`
  margin-top: 0.5rem;
  background: #ecf0f1;
  padding: 0.5rem;
  border-radius: 6px;
`;

const PositionRow = styled.div`
  background-color: #fff;
  padding: 0.5rem;
  margin: 0.5rem 0;
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
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.5rem;
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
