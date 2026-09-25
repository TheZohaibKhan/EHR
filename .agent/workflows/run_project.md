---
description: "Run the full project end-to-end: blockchain, contracts, and frontend."
---

This workflow automates the process of executing the EHR project.

## Prerequisites
1.  **Node.js**: Installed.
2.  **Ganache**: Running on port `7545` (Personal Ethereum Blockchain).
3.  **MetaMask**: Configured in browser.

## Steps

### 1. Install Dependencies
Ensure all project dependencies are installed.
```bash
npm install
```

### 2. Run Blockchain Migration (Smart Contract Deployment)
Deploy the smart contracts to the local blockchain (Ganache).
// turbo
```bash
cd src && npx truffle migrate --reset
```

### 3. Start Frontend
Launch the React application.
```bash
npm start
```

## Additional Notes
*   **Manual Wallet Entry**: When registering, you can now manually enter the wallet address. This address will be used to sign the transaction.
*   **MetaMask**: Ensure you are connected to `Localhost:7545` and have imported an account with ETH.
