import * as ethers from "ethers";

// Set your deployed contract address via environment variable or fallback:
const CONTRACT_ADDRESS = "0x1b048BEcA83b6dc765BD3A0c930E67Aaf2187091";

// Minimal ABI from your VotingEvent contract
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_startTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_endTime", "type": "uint256" }
    ],
    "name": "createEvent",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_eventId", "type": "uint256" },
      { "internalType": "string", "name": "_winner", "type": "string" }
    ],
    "name": "finalizeEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_eventId", "type": "uint256" }],
    "name": "getEvent",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "startTime", "type": "uint256" },
          { "internalType": "uint256", "name": "endTime", "type": "uint256" },
          { "internalType": "bool", "name": "finalized", "type": "bool" },
          { "internalType": "string", "name": "winner", "type": "string" }
        ],
        "internalType": "struct VotingEvent.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

/**
 * Waits for window.ethereum to be available (polls for up to 10 seconds).
 */
function waitForEthereum() {
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

/**
 * Initializes the blockchain connection.
 */
export async function initBlockchain() {
  try {
    await waitForEthereum();
    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const addr = await signer.getAddress();
    console.log("Wallet connected. Account:", addr);
    return contract;
  } catch (error) {
    console.error("initBlockchain error:", error);
    throw new Error("User denied account access or error connecting to wallet.");
  }
}

/**
 * Connects the wallet.
 */
export async function connectWallet() {
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

/**
 * Checks if the wallet is already connected.
 */
export async function isWalletConnected() {
  if (typeof window !== "undefined" && window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts && accounts.length > 0;
  }
  return false;
}

/**
 * Creates a new voting event on-chain.
 * @param {Object} param0 Object with name, description, startTime, and endTime.
 */
export async function createVotingEvent({ name, description, startTime, endTime }) {
  try {
    if (!contract) {
      await initBlockchain();
    }
    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    const tx = await contract.createEvent(name, description, startTimestamp, endTimestamp);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error in createVotingEvent:", error);
    throw error;
  }
}

/**
 * Finalizes a voting event on-chain.
 * @param {number} eventId The event ID.
 * @param {string} winner The winner's name.
 */
export async function finalizeVotingEvent(eventId, winner) {
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
