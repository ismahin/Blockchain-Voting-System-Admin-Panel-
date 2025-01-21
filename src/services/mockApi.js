// src/services/mockApi.js

let clubs = [
    {
      id: 1,
      name: 'Chess Club',
      description: 'A club for chess enthusiasts.',
      positions: ['President', 'Vice President', 'Secretary'],
      isActive: true,
    },
    {
      id: 2,
      name: 'Drama Club',
      description: 'Theater and performance arts club.',
      positions: ['Director', 'Actor', 'Stage Manager'],
      isActive: false,
    },
  ];
  
  let candidates = [
    {
      id: 1,
      name: 'Alice',
      clubId: 1,
      position: 'President',
      votes: 10,
    },
    {
      id: 2,
      name: 'Bob',
      clubId: 2,
      position: 'Director',
      votes: 7,
    },
  ];
  
  let applications = [
    {
      id: 1,
      name: 'Charlie',
      clubId: 1,
      position: 'Secretary',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Diana',
      clubId: 2,
      position: 'Actor',
      status: 'pending',
    },
  ];
  
  /**
   * EVENTS: now contain lineItems for dynamic clubs/positions/candidates
   */
  let events = [
    {
      id: 1,
      name: 'Spring 2025 Elections',
      description: 'Elections for all clubs in Spring 2025 semester',
      startDate: '2025-04-01',
      endDate: '2025-04-10',
      lineItems: [
        { clubId: 1, position: 'President', candidateIds: [1] },
      ],
    },
  ];
  
  // ========== CLUBS ==========
  export function getAllClubs() {
    return Promise.resolve([...clubs]);
  }
  export function createClub({ name, description, positions }) {
    const newClub = {
      id: clubs.length + 1,
      name,
      description,
      positions,
      isActive: true,
    };
    clubs.push(newClub);
    return Promise.resolve(newClub);
  }
  export function updateClub(id, updatedData) {
    clubs = clubs.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    return Promise.resolve(clubs.find((c) => c.id === id));
  }
  export function deleteClub(id) {
    clubs = clubs.filter((c) => c.id !== id);
    return Promise.resolve(true);
  }
  
  // ========== CANDIDATES ==========
  export function getAllCandidates() {
    return Promise.resolve([...candidates]);
  }
  export function createCandidate({ name, clubId, position }) {
    const newCandidate = {
      id: candidates.length + 1,
      name,
      clubId,
      position,
      votes: 0,
    };
    candidates.push(newCandidate);
    return Promise.resolve(newCandidate);
  }
  export function updateCandidate(id, updatedData) {
    candidates = candidates.map((cand) =>
      cand.id === id ? { ...cand, ...updatedData } : cand
    );
    return Promise.resolve(candidates.find((cand) => cand.id === id));
  }
  export function deleteCandidate(id) {
    candidates = candidates.filter((cand) => cand.id !== id);
    return Promise.resolve(true);
  }
  
  // ========== APPLICATIONS ==========
  export function getAllApplications() {
    return Promise.resolve([...applications]);
  }
  export function createApplication({ name, clubId, position }) {
    const newApp = {
      id: applications.length + 1,
      name,
      clubId,
      position,
      status: 'pending',
    };
    applications.push(newApp);
    return Promise.resolve(newApp);
  }
  export function updateApplication(id, updatedData) {
    applications = applications.map((app) =>
      app.id === id ? { ...app, ...updatedData } : app
    );
    return Promise.resolve(applications.find((app) => app.id === id));
  }
  export function deleteApplication(id) {
    applications = applications.filter((app) => app.id !== id);
    return Promise.resolve(true);
  }
  
  // ========== EVENTS ==========
  export function getAllEvents() {
    return Promise.resolve([...events]);
  }
  export function createEvent({
    name,
    description,
    startDate,
    endDate,
    lineItems,
  }) {
    const newEvent = {
      id: events.length + 1,
      name,
      description,
      startDate,
      endDate,
      lineItems: lineItems || [],
    };
    events.push(newEvent);
    return Promise.resolve(newEvent);
  }
  export function updateEvent(id, updatedData) {
    events = events.map((evt) =>
      evt.id === id ? { ...evt, ...updatedData } : evt
    );
    return Promise.resolve(events.find((e) => e.id === id));
  }
  export function deleteEvent(id) {
    events = events.filter((evt) => evt.id !== id);
    return Promise.resolve(true);
  }
  