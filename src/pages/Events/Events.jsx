// src/pages/Events/Events.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllEvents, getAllClubs, createEvent, deleteEvent } from '../../services/mockApi';
import EventForm from '../../components/forms/EventForm';
import EditEventModal from './EditEventModal';

function Events() {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [evtData, clubData] = await Promise.all([getAllEvents(), getAllClubs()]);
    setEvents(evtData);
    setClubs(clubData);
  };

  const handleCreateEvent = async (formData) => {
    await createEvent(formData);
    setShowCreateForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchData();
  };

  return (
    <Container>
      <HeaderRow>
        <h2>Voting Events</h2>
        <CreateButton onClick={() => setShowCreateForm(true)}>
          Create Event
        </CreateButton>
      </HeaderRow>

      {showCreateForm && (
        <FormWrapper>
          <EventForm clubs={clubs} onSubmitEvent={handleCreateEvent} onCancel={() => setShowCreateForm(false)} />
        </FormWrapper>
      )}

      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Event Name</th>
            <th>Date Range</th>
            <th>Clubs</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((evt) => {
            const participatingClubs = clubs.filter((c) => evt.clubIds.includes(c.id));
            return (
              <tr key={evt.id}>
                <td>{evt.id}</td>
                <td>
                  <strong>{evt.name}</strong>
                  <Desc>{evt.description}</Desc>
                </td>
                <td>
                  {evt.startDate} ~ {evt.endDate}
                </td>
                <td>
                  {participatingClubs.map((c) => c.name).join(', ') || 'No Clubs'}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <ActionButton onClick={() => setEditEventId(evt.id)}>Edit</ActionButton>
                  <DeleteButton onClick={() => handleDelete(evt.id)}>Delete</DeleteButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {editEventId && (
        <EditEventModal
          eventId={editEventId}
          onClose={() => {
            setEditEventId(null);
            fetchData();
          }}
        />
      )}
    </Container>
  );
}

export default Events;

// ====== Styled Components ======
const Container = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateButton = styled.button`
  background-color: #27ae60;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #2ecc71;
  }
`;

const FormWrapper = styled.div`
  margin-bottom: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
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

const Desc = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;
