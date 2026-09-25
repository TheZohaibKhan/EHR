# Sequence Diagram: Uploading a Medical Record

This diagram details the exact step-by-step process when a user uploads a medical record to the decentralized EHR system.

```mermaid
sequenceDiagram
    autonumber
    actor User as Patient/Doctor
    participant UI as React Dashboard
    participant Pinata as Pinata IPFS
    participant Wallet as MetaMask
    participant Blockchain as Ethereum Network
    participant Contract as UploadEhr SC

    Note over User, UI: Step 1: File Upload (Off-Chain)
    User->>UI: Selects Medical File (PDF/Image)
    UI->>Pinata: Uploads File (API Request)
    activate Pinata
    Pinata-->>UI: Returns IPFS Hash (CID)
    deactivate Pinata
    
    Note over UI, Blockchain: Step 2: Blockchain Storage (On-Chain)
    UI->>Wallet: Requests Transaction: addRecord(Hash)
    activate Wallet
    Wallet-->>User: Prompts for Gas Fee Approval
    User->>Wallet: Confirms Transaction
    Wallet->>Blockchain: Broadcasts Transaction
    deactivate Wallet
    
    activate Blockchain
    Blockchain->>Contract: Executes addRecord()
    Contract->>Contract: Stores Hash + Timestamp
    Contract-->>Blockchain: Emits Success Event
    deactivate Blockchain
    
    Blockchain-->>UI: Returns Transaction Receipt
    UI-->>User: Displays "Success! Hash Stored"
```

## Detailed Flow

1.  **Selection**: The user selects a file (e.g., X-Ray) in the React Application.
2.  **IPFS Upload**: The app sends the file to **Pinata**. This is an off-chain action and does not incur gas fees.
3.  **Hash Generation**: Pinata stores the file and returns a unique **CID (Hash)**.
4.  **Transaction Request**: The app constructs a transaction to calling the smart contract `addRecord` function with this Hash.
5.  **Signing**: MetaMask pops up, asking the user to pay the **Gas Fee** for storing this small string.
6.  **Execution**: The transaction is mined on Ethereum. The Hash is permanently linked to the user's wallet address.
7.  **Confirmation**: The UI updates to show the successful link.
