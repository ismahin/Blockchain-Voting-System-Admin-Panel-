// src/pages/Candidates/Candidates.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getAllCandidates,
  getAllClubs,
  deleteCandidate,
  createCandidate,
} from '../../services/mockApi';

// Components
import CandidateForm from '../../components/forms/CandidateForm';
import CandidateFilter from '../../components/forms/CandidateFilter';
import EditCandidateModal from './EditCandidateModal';

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [positions, setPositions] = useState([]);  
  const [editCandidateId, setEditCandidateId] = useState(null);

  // Filter state
  const [filter, setFilter] = useState({
    searchName: '',
    clubId: '',
    position: '',
  });

  // Show/hide add form
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    extractPositions();
  }, [clubs]);

  const fetchData = async () => {
    const [candData, clubData] = await Promise.all([
      getAllCandidates(),
      getAllClubs(),
    ]);
    setCandidates(candData);
    setClubs(clubData);
  };

  // Gather all possible positions from clubs (and/or existing candidates)
  const extractPositions = () => {
    const allPositions = new Set();
    clubs.forEach((club) => {
      club.positions.forEach((pos) => allPositions.add(pos));
    });
    setPositions([...allPositions]);
  };

  const handleDelete = async (id) => {
    await deleteCandidate(id);
    fetchData();
  };

  const handleAddCandidate = async (candData) => {
    // candData = { name, clubId, position }
    await createCandidate(candData);
    setShowAddForm(false);
    fetchData();
  };

  // Filtering logic
  const filteredCandidates = candidates.filter((cand) => {
    // Filter by name
    if (filter.searchName && !cand.name.toLowerCase().includes(filter.searchName.toLowerCase())) {
      return false;
    }
    // Filter by club
    if (filter.clubId && cand.clubId !== Number(filter.clubId)) {
      return false;
    }
    // Filter by position
    if (filter.position && cand.position !== filter.position) {
      return false;
    }
    return true;
  });

  const getClubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : 'N/A';
  };

  return (
    <Container>
      <h2>Manage Candidates</h2>

      <CandidateFilter
        filter={filter}
        onChangeFilter={setFilter}
        clubs={clubs}
        positions={positions}
      />

      <HeaderRow>
        <AddButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Hide Form' : 'Add Candidate'}
        </AddButton>
      </HeaderRow>
      
      {showAddForm && (
        <FormWrapper>
          <CandidateForm clubs={clubs} onAddCandidate={handleAddCandidate} />
        </FormWrapper>
      )}

      <CandidateList>
        {filteredCandidates.map((cand) => (
          <CandidateCard key={cand.id}>
            <h3>{cand.name}</h3>
            <p>Club: {getClubName(cand.clubId)}</p>
            <p>Position: {cand.position}</p>
            <p>Votes: {cand.votes}</p>
            <ButtonRow>
              <ActionButton onClick={() => setEditCandidateId(cand.id)}>
                Edit
              </ActionButton>
              <DeleteButton onClick={() => handleDelete(cand.id)}>
                Delete
              </DeleteButton>
            </ButtonRow>
          </CandidateCard>
        ))}
        {filteredCandidates.length === 0 && (
          <NoResults>No candidates found.</NoResults>
        )}
      </CandidateList>

      {editCandidateId && (
        <EditCandidateModal
          candidateId={editCandidateId}
          clubs={clubs}
          onClose={() => {
            setEditCandidateId(null);
            fetchData();
          }}
        />
      )}
    </Container>
  );
}

export default Candidates;

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
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const AddButton = styled.button`
  background-color: #27ae60;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #2ecc71;
  }
`;

const FormWrapper = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
`;

const CandidateList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CandidateCard = styled.div`
  width: 240px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  padding: 1rem;

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.25rem 0;
    color: #555;
  }
`;

const ButtonRow = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
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

const NoResults = styled.div`
  color: #7f8c8d;
  font-style: italic;
  margin-top: 1rem;
`;
