// src/pages/Events/EditEventModal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllEvents, getAllClubs, updateEvent } from '../../services/mockApi';

function EditEventModal({ eventId, onClose }) {
  const [eventData, setEventData] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClubs, setSelectedClubs] = useState([]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const loadData = async () => {
    const [evts, clubList] = await Promise.all([getAllEvents(), getAllClubs()]);
    setClubs(clubList);
    const evt = evts.find((e) => e.id === eventId);
    if (evt) {
      setEventData(evt);
      setName(evt.name);
      setDescription(evt.description);
      setStartDate(evt.startDate);
      setEndDate(evt.endDate);
      setSelectedClubs(evt.clubIds);
    }
  };

  const toggleClubSelection = (clubId) => {
    if (selectedClubs.includes(clubId)) {
      setSelectedClubs(selectedClubs.filter((id) => id !== clubId));
    } else {
      setSelectedClubs([...selectedClubs, clubId]);
    }
  };

  const handleSave = async () => {
    await updateEvent(eventId, {
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      clubIds: selectedClubs,
    });
    onClose();
  };

  if (!eventData) return null;

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
  width: 480px;
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
  font-weight: 500;
  color: #2c3e50;
  margin-top: 0.75rem;
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
  height: 60px;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
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
