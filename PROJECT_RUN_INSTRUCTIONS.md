# End-to-End Project Execution Guide

This guide provides step-by-step instructions to run the EHR application, including the blockchain backend (Smart Contracts) and the React frontend.

## Prerequisites
1.  **Node.js**: Ensure Node.js is installed.
2.  **Ganache**: Install and start [Ganache](https://trufflesuite.com/ganache/) (Personal Blockchain).
    *   **Port**: 7545
    *   **Network ID**: 5777 (or match your truffle configuration)
3.  **MetaMask**: Install the MetaMask browser extension.

## Project Structure
*   **Root Directory**: `d:\EHR` (Contains `package.json` for frontend dependencies)
*   **Source/Truffle Directory**: `d:\EHR\src` (Contains `truffle-config.js`, `contracts`, `migrations`)

## Step-by-Step Execution

### 1. Install Dependencies
Open a terminal in the project root (`d:\EHR`) and run:
```bash
npm install
```

### 2. Configure & Deploy Smart Contracts
The smart contracts are located in `src/contracts` and need to be deployed to your local Ganache blockchain.

1.  Open your terminal and navigate to the `src` folder:
    ```bash
    cd src
    ```
2.  Compile and Deploy the contracts:
    ```bash
    npx truffle migrate --reset
    ```
    *   *Note: Ensure Ganache is running before executing this command.*
    *   *This command compiles the Solidity contracts and deploys them to the network specified in `truffle-config.js` (development: port 7545).*
    *   *Artifacts will be generated in `src/build/contracts`.*

### 3. Configure MetaMask
1.  Open MetaMask in your browser.
2.  Connect to your **Localhost 7545** network.
    *   **RPC URL**: `http://127.0.0.1:7545`
    *   **Chain ID**: 1337 (default for Ganache) or as configured.
3.  **Import Accounts**: Import one or more accounts from Ganache into MetaMask using their **Private Keys** to have funds (ETH) for testing transactions.

### 4. Run the React Application
1.  Navigate back to the project root (`d:\EHR`) if you are still in `src`:
    ```bash
    cd ..
    ```
2.  Start the development server:
    ```bash
    npm start
    ```
3.  The application should open in your default browser at `http://localhost:3000`.

## Testing the Application
*   **Registration**: Navigate to the Doctor, Patient, or Diagnostic registration pages.
*   **Manual Wallet Entry**: You can now manually enter or paste the wallet address (that you imported into MetaMask) into the "Wallet Public Address" field.
*   **Transactions**: When you click "Register", MetaMask will prompt you to confirm the transaction. Ensure you are connected to the correct account.

## Troubleshooting
*   **Network Mismatch**: If you see "Smart contract not deployed to this network", ensure MetaMask is connected to the same network (Localhost 7545) where you ran `truffle migrate`.
*   **Resetting**: If you restart Ganache, you must run `npx truffle migrate --reset` again and reset your MetaMask account history (Settings > Advanced > Clear Activity Tab Data) to avoid Nonce errors.
