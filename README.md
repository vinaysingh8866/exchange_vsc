# VSC Exchange

The repository contains the necessary code for deploying the VSC Exchange. Below is a guide to understanding the structure of this repository and how to set up the project.

## Repository Structure

### 1. Interface
This folder contains the UI code for the VSC Exchange, allowing users to interact with the exchange functionalities such as swapping tokens, adding liquidity, and viewing their balances.

**Tech Stack:**
- React.js
- Web3.js / Ethers.js
- TailwindCSS (for styling)

**Setup Instructions:**
1. Navigate to the `interface` folder:
   ```bash
   cd interface
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by creating a `.env` file in the `interface` folder. 
4. Start the development server:
   ```bash
   npm start
   ```

### 2. v2-sdk
This folder contains the SDK that is used by the `interface` for interacting with the exchange contracts and performing token-related calculations.

**Key Features:**
- Handles token price calculations
- Provides utilities for interacting with liquidity pools
- Simplifies on-chain interactions

**Setup Instructions:**
1. Navigate to the `v2-sdk` folder:
   ```bash
   cd v2-sdk
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the SDK:
   ```bash
   npm run build
   ```

### 3. Contracts
This folder contains the Solidity contracts for the exchange, including core contracts for token swaps and liquidity management.

**Key Contracts:**
- `UniswapV2Pair`: Manages liquidity pools
- `UniswapV2Factory`: Responsible for creating new liquidity pairs
- `UniswapV2Router02`: Handles token swapping and liquidity interactions

**Setup Instructions:**
1. Navigate to the `contracts` folder:
   ```bash
   cd contracts
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the contracts:
   ```bash
   npx hardhat compile
   ```
4. Deploy the contracts:
   - Create a `.env` file with the following:
     ```bash
     PRIVATE_KEY=<your-private-key>
     ```
   - Run the deployment script:
     ```bash
     npx hardhat run scripts/deploy.js --network <network-name>
     ```

## Running the Project
1. Ensure all dependencies are installed in the respective folders (`interface`, `v2-sdk`, `contracts`).
2. Deploy the contracts by following the steps in the `contracts` folder setup instructions.
3. Update the `REACT_APP_CONTRACT_ADDRESS` in the `interface` `.env` file with the deployed contract address.
4. Start the `interface` development server.

## Additional Notes
- **Testing:** Use `npx hardhat test` to run contract tests located in the `contracts/test` folder.
- **Networks:** Ensure you configure the network details (e.g., Ethereum mainnet or testnets like Ropsten or Goerli) in the `.env` files.
- **Contributions:** Pull requests and issues are welcome for improvements.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

Enjoy using the VSC Exchange! Feel free to reach out for any support or feedback.

