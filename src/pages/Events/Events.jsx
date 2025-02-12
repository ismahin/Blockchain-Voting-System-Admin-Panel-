// src/pages/Events/Events.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EventForm from '../../components/forms/EventForm';
import { ethers } from 'ethers';
import VotingEventArtifact from '../../artifacts/contracts/VotingEvent.sol/VotingEvent.json';

const CONTRACT_ADDRESS =
  import.meta.env.VITE_VOTING_EVENT_CONTRACT_ADDRESS ||
  "0x1b048BEcA83b6dc765BD3A0c930E67Aaf2187091";

const CONTRACT_ABI = VotingEventArtifact.abi;

let provider;
let signer;
let contract;

async function waitForEthereum() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.ethereum) {
        clearInterval(interval);
        resolve(window.ethereum);
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Ethereum wallet not found. Please install MetaMask."));
    }, 10000);
  });
}

async function initBlockchain() {
  try {
    await waitForEthereum();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const addr = await signer.getAddress();
    console.log("Wallet connected. Account:", addr);
    return contract;
  } catch (error) {
    console.error("initBlockchain error:", error);
    throw new Error("User denied account access or error connecting to wallet.");
  }
}

async function connectWallet() {
  try {
    const eth = await waitForEthereum();
    const accounts = await eth.request({ method: "eth_requestAccounts" });
    console.log("connectWallet: accounts", accounts);
    return accounts;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw new Error("User denied wallet connection.");
  }
}

async function isWalletConnected() {
  if (typeof window !== "undefined" && window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts && accounts.length > 0;
  }
  return false;
}

async function getEventCount() {
  if (!contract) {
    await initBlockchain();
  }
  const count = await contract.eventCount();
  return Number(count);
}

async function fetchAllEvents() {
  const count = await getEventCount();
  const events = [];
  for (let i = 1; i <= count; i++) {
    try {
      // Call the new function that returns explicit values
      const evt = await contract.getEventDetails(i);
      events.push({
        id: Number(evt[0]),
        name: evt[1],
        description: evt[2],
        startTime: Number(evt[3]),
        endTime: Number(evt[4]),
        finalized: evt[5],
        winner: evt[6],
      });
    } catch (error) {
      console.error("Error decoding event at index", i, error);
    }
  }
  return events;
}

async function createVotingEvent({ name, description, startDate, endDate }) {
  try {
    if (!contract) {
      await initBlockchain();
    }
    if (!startDate || !endDate) {
      throw new Error("Start and end dates are required");
    }
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
      throw new Error("Invalid start or end date format");
    }
    const tx = await contract.createEvent(name, description, startTimestamp, endTimestamp);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error in createVotingEvent:", error);
    throw error;
  }
}

async function finalizeVotingEvent(eventId, winner) {
  try {
    if (!contract) {
      await initBlockchain();
    }
    const tx = await contract.finalizeEvent(eventId, winner);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error in finalizeVotingEvent:", error);
    throw error;
  }
}

function Events() {
  const [events, setEvents] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshEvents();
    checkWallet();
  }, []);

  const refreshEvents = async () => {
    setLoading(true);
    try {
      const evtData = await fetchAllEvents();
      setEvents(evtData);
    } catch (error) {
      console.error("Error fetching blockchain events:", error);
    }
    setLoading(false);
  };

  const checkWallet = async () => {
    try {
      const connected = await isWalletConnected();
      setWalletConnected(connected);
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setWalletConnected(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateEvent = async (formData) => {
    try {
      if (!walletConnected) {
        alert("Please connect your wallet first.");
        return;
      }
      const tx = await createVotingEvent(formData);
      console.log("Blockchain transaction hash:", tx.hash);
      alert("Event created on blockchain. Tx hash: " + tx.hash);
      setShowCreateForm(false);
      refreshEvents();
    } catch (error) {
      alert("Error creating event: " + error.message);
    }
  };

  return (
    <Container>
      <HeaderRow>
        <h2>Voting Events</h2>
        <HeaderButtons>
          <RefreshButton onClick={refreshEvents}>Refresh</RefreshButton>
          {!walletConnected ? (
            <ConnectButton onClick={handleConnectWallet}>Connect Wallet</ConnectButton>
          ) : (
            <CreateButton onClick={() => setShowCreateForm(true)}>Create Event</CreateButton>
          )}
        </HeaderButtons>
      </HeaderRow>
      {showCreateForm && walletConnected && (
        <FormWrapper>
          <EventForm onSubmitEvent={handleCreateEvent} onCancel={() => setShowCreateForm(false)} />
        </FormWrapper>
      )}
      {loading ? (
        <LoadingMessage>Loading events...</LoadingMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Event Name</th>
              <th>Date Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((evt) => (
                <tr key={evt.id}>
                  <td>{evt.id}</td>
                  <td>
                    <strong>{evt.name}</strong>
                    <Desc>{evt.description}</Desc>
                  </td>
                  <td>
                    {new Date(evt.startTime * 1000).toLocaleString()} ~ {new Date(evt.endTime * 1000).toLocaleString()}
                  </td>
                  <td>
                    {evt.finalized ? (
                      <span style={{ color: 'green' }}>
                        Finalized (Winner: {evt.winner})
                      </span>
                    ) : (
                      <span style={{ color: 'orange' }}>Ongoing</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No events found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Events;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const RefreshButton = styled.button`
  background-color: #f39c12;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
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

const ConnectButton = styled.button`
  background-color: #2980b9;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #3498db;
  }
`;

const FormWrapper = styled.div`
  margin-bottom: 1rem;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  background-color: #fff;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  thead {
    background-color: #2980b9;
    color: #fff;
  }
  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    vertical-align: middle;
  }
  tr:not(:last-child) td {
    border-bottom: 1px solid #ddd;
  }
`;

const Desc = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  font-size: 1rem;
  color: #7f8c8d;
  text-align: center;
  padding: 1rem;
`;
