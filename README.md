# Decentralized Voting (dVoting)

A decentralized voting system based on [Ethereum blockchain](https://ethereum.org/dapps/) technology.

## System Workflow

A brief explanation on the basic workflow of the application.

4 stages of Election process

- Stage 1: Init
  - Admin: Init the smart contract, add all the candidates. And turn into `Reg Stage` at last
  - Voter: Wait for register stage
- Stage 2: Register
  - Admin: Manage all the registration of voters. Turn into `Vote Stage` if all the voters is done registered or the time for `Reg Stage` is out.
  - Voter: register for the election
- State 3: Vote
  - Admin: Check all the vote of voters. Turn into `Done Stage` if all the voters is done voted or the time for `Vote Stage` is out.
  - Voter: vote for the candidates by point from (1 to candidatesNumber)
- Stage 4: Done
  - Show the results dashboard

---

## Setting up the development environment

### Requirements

- [Node.js](https://nodejs.org)
- [Truffle](https://www.trufflesuite.com/truffle)
- [Ganache](https://github.com/trufflesuite/ganache-cli) (Cli)
- [Metamask](https://metamask.io/) (Browser Extension)

#### Getting the requirements

1. Download and install NodeJS

   > NodeJs

2. Install truffle and ganache-cli

   > truffle
   > ganache-cli

   ```shell
   npm install -g truffle
   npm install -g ganache-cli
   ```

3. Install metamask browser extension

   Download and install metamask from [here](https://metamask.io/download 'Go to official metamask download page.').

### Configuring the project for development

1. Run local Ethereum blockchain

   ```shell
   ganache-cli
   ```

   > Note: Do not close `ganache-cli` (the blockchain network needs to be running all the time). Or using Ganache if do not want to be cleared all after `ganache-cli` exist

2. Configure metamask on the browser with following details

   New RPC URL: `http://localhost:8545`  
   Chain ID: `1337`

3. Import accounts using private keys from ganache-cli to the metamask extension on the browser
4. Deploy smart contract to the (local) blockchain

   ```shell
   # on the dVoting directory
   truffle migrate
   ```

   > Note: Use `truffle migrate --reset` for re-deployments

5. Launch the development server (fronted)

   ```shell
   cd client
   npm install
   npm start
   ```
