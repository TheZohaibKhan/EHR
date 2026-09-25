# Deployment Diagram: Decentralized EHR System

This diagram illustrates how the **Decentralized Electronic Health Record (EHR)** system is deployed and how its components interact.

```mermaid
graph TD
    %% Nodes
    subgraph Client [User's Device (Browser)]
        UI[React Application UI]
        Wallet[MetaMask Wallet]
    end

    subgraph Hosting [Web Server (Local/Cloud)]
        AppServer[React Build Files]
    end

    subgraph Storage [IPFS / Pinata Cloud]
        IPFSNode[IPFS Network]
        Files[Medical Records (PDF, X-Ray)]
    end

    subgraph Blockchain [Ethereum Network (Ganache/Testnet)]
        EthNode[Ethereum Node]
        Contracts[Smart Contracts: UploadEhr, PatientRegistration]
        Ledger[Immutable Ledger (Hashes)]
    end

    %% Interactions
    User((User)) -- Access URL --> UI
    UI -- Fetches App --> AppServer
    
    %% File Upload Flow
    UI -- 1. Uploads File --> IPFSNode
    IPFSNode -- Stores --> Files
    IPFSNode -- 2. Returns Hash (CID) --> UI
    
    %% Blockchain Transaction Flow
    UI -- 3. Sends Hash Transaction --> Wallet
    Wallet -- Signs & Broadcasts --> EthNode
    EthNode -- Executes --> Contracts
    Contracts -- Stores Hash on --> Ledger

    %% Styling
    classDef storage fill:#f9f,stroke:#333,stroke-width:2px;
    classDef blockchain fill:#ccf,stroke:#333,stroke-width:2px;
    classDef user fill:#ff9,stroke:#333,stroke-width:2px;
    classDef client fill:#eef,stroke:#333,stroke-width:1px;
    
    class IPFSNode,Files storage;
    class EthNode,Contracts,Ledger blockchain;
    class User user;
    class Client client;
```

## Explanation of Components

1.  **Client Device (User's Browser)**:
    *   **React Application (UI)**: The frontend interface where patients and doctors interact.
    *   **MetaMask Wallet**: A browser extension that holds the user's private keys and authorizes transactions on the blockchain.

2.  **Web Server**:
    *   Serves the static files (HTML, JS, CSS) of the React application to the user's browser. In development, this is your `localhost:3000`.

3.  **IPFS / Pinata Cloud (Storage Layer)**:
    *   **Role**: Stores the heavy medical files (PDFs, Images) securely and permanently.
    *   **Interaction**: The app uploads files here first to avoid high gas fees on Ethereum. Pinata returns a unique content hash (CID).

4.  **Ethereum Blockchain (Logic & Verification Layer)**:
    *   **Role**: Executes Smart Contracts and stores the *proof* of the medical records (the IPFS Hash).
    *   **Smart Contracts**:
        *   `PatientRegistration`: Manages user identities and permissions.
        *   `UploadEhr`: Stores the link between a Patient's Address and their IPFS File Hash.
    *   **Ledger**: An immutable record of all uploads and access grants.

## Use Case: Uploading a Record

1.  **User** selects a file on the **React UI**.
2.  **React UI** uploads the file to **Pinata (IPFS)**.
3.  **Pinata** returns a unique hash (e.g., `QmXyZ...`).
4.  **React UI** requests **MetaMask** to sign a transaction containing this hash.
5.  **User** approves the transaction.
6.  The transaction is sent to the **Ethereum Blockchain**.
7.  The **Smart Contract** verifies the user and permanently stores the hash on the **Ledger**.
