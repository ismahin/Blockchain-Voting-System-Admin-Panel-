// src/components/forms/CandidateFilter.jsx
import React from 'react';
import styled from 'styled-components';

function CandidateFilter({ filter, onChangeFilter, clubs, positions }) {
  const handleInputChange = (e) => {
    onChangeFilter({ ...filter, [e.target.name]: e.target.value });
  };

  return (
    <FilterContainer>
      <Label>Name:</Label>
      <FilterInput
        type="text"
        name="searchName"
        value={filter.searchName}
        placeholder="Search by name..."
        onChange={handleInputChange}
      />

      <Label>Club:</Label>
      <FilterSelect
        name="clubId"
        value={filter.clubId}
        onChange={handleInputChange}
      >
        <option value="">All Clubs</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </FilterSelect>

      <Label>Position:</Label>
      <FilterSelect
        name="position"
        value={filter.position}
        onChange={handleInputChange}
      >
        <option value="">All Positions</option>
        {positions.map((pos, idx) => (
          <option key={idx} value={pos}>
            {pos}
          </option>
        ))}
      </FilterSelect>
    </FilterContainer>
  );
}

export default CandidateFilter;

// ====== Styled Components ======
const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const FilterInput = styled.input`
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const FilterSelect = styled.select`
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
