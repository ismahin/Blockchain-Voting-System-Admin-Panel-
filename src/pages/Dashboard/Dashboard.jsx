// src/pages/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getAllClubs, getAllCandidates, getAllEvents } from '../../services/mockApi';

function Dashboard() {
  const [clubCount, setClubCount] = useState(0);
  const [candidateCount, setCandidateCount] = useState(0);
  const [runningEvents, setRunningEvents] = useState([]);

  useEffect(() => {
    loadCounts();
    loadEvents();
  }, []);

  const loadCounts = async () => {
    const [clubs, candidates] = await Promise.all([
      getAllClubs(),
      getAllCandidates(),
    ]);
    setClubCount(clubs.length);
    setCandidateCount(candidates.length);
  };

  const loadEvents = async () => {
    const allEvents = await getAllEvents();
    const now = new Date(); // today's date/time
  
    const ongoing = allEvents.filter((evt) => {
      const start = new Date(evt.startDate);
      const end = new Date(evt.endDate);
      return start <= now && now <= end;
    });
    setRunningEvents(ongoing);
  };

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>

      <CardRow>
        <Card>
          <CardHeader>Total Clubs</CardHeader>
          <CardBody>{clubCount}</CardBody>
        </Card>
        <Card>
          <CardHeader>Total Candidates</CardHeader>
          <CardBody>{candidateCount}</CardBody>
        </Card>
      </CardRow>

      <h2>Running (Ongoing) Events</h2>
      {runningEvents.length === 0 ? (
        <NoEvents>No events are currently running.</NoEvents>
      ) : (
        <EventList>
          {runningEvents.map((event) => (
            <EventCard key={event.id}>
              <strong>{event.name}</strong>
              <p>{event.description}</p>
              <small>
                {event.startDate} ~ {event.endDate}
              </small>
            </EventCard>
          ))}
        </EventList>
      )}
    </DashboardContainer>
  );
}

export default Dashboard;

// ====== Styled Components ======
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #2c3e50;
  }
`;

const CardRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  background-color: #2980b9;
  padding: 0.75rem 1rem;
  color: #fff;
  font-weight: bold;
`;

const CardBody = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  color: #2c3e50;
`;

const NoEvents = styled.div`
  font-style: italic;
  color: #7f8c8d;
`;

const EventList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  width: 250px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);

  strong {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }
  p {
    margin-bottom: 0.5rem;
  }
  small {
    color: #7f8c8d;
  }
`;
