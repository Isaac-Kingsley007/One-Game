# 🎮 One Game

<div align="center">

![One Game Banner](https://img.shields.io/badge/OneChain-Game-blue?style=for-the-badge)
![Move](https://img.shields.io/badge/Move-Smart_Contract-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A Decentralized, Transparent Staking and Betting Game Platform on OneChain**

[Demo](https://github.com/Isaac-Kingsley007/One-Game) · [Report Bug](https://github.com/Isaac-Kingsley007/One-Game/issues) · [Request Feature](https://github.com/Isaac-Kingsley007/One-Game/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
  - [Problem Statement](#problem-statement)
  - [Solution](#solution)
  - [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Installation](#frontend-installation)
  - [Smart Contract Setup](#smart-contract-setup)
- [Usage](#usage)
- [Smart Contract Details](#smart-contract-details)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

---

## 🎯 About The Project

### Problem Statement

The current landscape of staking and betting games faces a critical trust issue:

- **Lack of Transparency**: Traditional betting platforms operate as black boxes where users cannot verify fairness
- **Centralized Control**: Game operators have complete control over funds and outcomes
- **Trust Requirements**: Players must trust the platform to hold their funds and execute payouts honestly
- **Limited Verifiability**: No way for users to audit game logic or fund movements
- **Hidden Fees**: Platforms can change rules or fees without transparency

Despite the clear need for Web3's transparency and trustlessness, most betting and staking games continue to operate on centralized systems, leaving users vulnerable to manipulation and fraud.

### Solution

**One Game** leverages the OneChain blockchain to create a fully decentralized, transparent, and trustless gaming platform:

✅ **Smart Contract Escrow**: Funds are held in transparent, auditable smart contracts  
✅ **Automated Payouts**: Winners receive funds automatically through blockchain execution  
✅ **Complete Transparency**: All game logic and fund movements are visible on-chain  
✅ **Trustless Operation**: No intermediary or centralized authority controls the funds  
✅ **Gas-Sponsored Transactions**: Optional sponsored transactions for seamless UX  
✅ **Provably Fair**: All game outcomes can be verified on the blockchain

### Key Features

#### 🔐 **Decentralized Escrow System**
- Smart contract holds all player funds securely
- No single party can access or manipulate escrowed tokens
- Automatic fund distribution to winners

#### 🎲 **Two-Player Game Mechanics**
- Create games with custom entry amounts
- Fair matchmaking system
- Real-time game state updates

#### 💰 **Transparent Token Management**
- All transactions recorded on OneChain blockchain
- OCT token support for betting
- Winner-takes-all prize distribution

#### ⚡ **Gas Sponsorship Ready**
- Infrastructure for sponsored transactions
- Reduce onboarding friction for new users
- Optional gas payment by platform

#### 🔍 **Complete Auditability**
- View all game events on blockchain explorer
- Verify game outcomes independently
- Track fund movements in real-time

#### 🛡️ **Security First**
- Tested and audited Move smart contracts
- No admin privileges or backdoors
- Immutable game logic

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain Integration**: OneChain Sui SDK (`@onelabs/sui`)
- **State Management**: React Hooks
- **Wallet Connection**: OneChain Wallet Standard

### Smart Contracts
- **Language**: [Move](https://move-book.com/) - Secure smart contract language
- **Platform**: [OneChain](https://onelabs.cc/) - High-performance blockchain
- **Token Standard**: OCT (OneChain Token)
- **Development**: OneChain CLI tools

### Infrastructure
- **RPC Network**: OneChain Testnet/Mainnet
- **Development**: Rust, Cargo
- **Testing**: Move testing framework

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Game UI    │  │   Wallet     │  │   Dashboard  │  │
│  │   Interface  │  │  Connection  │  │   & Stats    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ (SDK)
┌─────────────────────────────────────────────────────────┐
│              OneChain Blockchain Network                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Game Escrow Smart Contract               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Create   │  │    Join    │  │  Finish   │  │  │
│  │  │    Game    │  │    Game    │  │   Game    │  │  │
│  │  └────────────┘  └────────────┘  └───────────┘  │  │
│  │                                                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Cancel   │  │   Events   │  │   View    │  │  │
│  │  │    Game    │  │  Emission  │  │  Functions│  │  │
│  │  └────────────┘  └────────────┘  └───────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  User Wallets (OCT)                      │
│           Player 1              Player 2                 │
└─────────────────────────────────────────────────────────┘
```

**Game Flow:**
1. **Player 1** creates game → Deposits OCT to escrow
2. **Player 2** joins game → Deposits equal OCT to escrow
3. **Game plays** → Both players compete
4. **Winner determined** → Smart contract releases all OCT to winner
5. **Transaction recorded** → Immutable on-chain record

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

#### For Frontend Development:
- **Node.js** (v18 or higher)
  ```bash
  node --version  # Should be v18+
  ```
- **npm** or **yarn** or **pnpm**
  ```bash
  npm --version
  ```
- **Git**
  ```bash
  git --version
  ```

#### For Smart Contract Development:
- **Rust** and **Cargo**
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  rustup update stable
  ```

- **OneChain CLI**
  ```bash
  cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing
  mv ~/.cargo/bin/one_chain ~/.cargo/bin/one
  ```

- **Additional Linux Dependencies** (if on Linux):
  ```bash
  sudo apt-get update
  sudo apt-get install curl git cmake gcc libssl-dev libclang-dev build-essential
  ```

---

### Frontend Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Isaac-Kingsley007/One-Game.git
cd One-Game
```

#### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

#### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# OneChain Configuration
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://rpc-testnet.onelabs.cc:443

# Smart Contract
NEXT_PUBLIC_PACKAGE_ID=your_deployed_package_id_here

# Optional: Analytics, etc.
NEXT_PUBLIC_APP_NAME=One Game
```

#### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### 5. Build for Production

```bash
npm run build
npm run start
```

---

### Smart Contract Setup

#### 1. Navigate to Smart Contract Directory

```bash
cd game_escrow
```

#### 2. Configure OneChain Client

First-time setup:

```bash
one client
```

Follow the prompts:
- Press `y` to connect to OneChain Full node
- Press Enter for Testnet (or enter custom RPC URL for Mainnet/Devnet)
- Choose key scheme: `0` for Ed25519 (recommended)
- **Save your recovery phrase securely!**

View your address:
```bash
one client active-address
```

#### 3. Get Test Tokens (Testnet Only)

**Option A: Using CLI**
```bash
one client faucet
```

**Option B: Using cURL**
```bash
curl --location --request POST 'https://faucet-testnet.onelabs.cc/v1/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
    "FixedAmountRequest": {
        "recipient": "YOUR_ADDRESS_HERE"
    }
}'
```

Verify your balance:
```bash
one client gas
```

#### 4. Build the Smart Contract

```bash
one move build
```

Expected output:
```
BUILDING One
BUILDING MoveStdlib
BUILDING game_escrow
```

#### 5. Run Tests

```bash
one move test
```

Expected output:
```
Running Move unit tests
[ PASS    ] game_escrow::escrow::test_cancel_game
[ PASS    ] game_escrow::escrow::test_cannot_join_twice
[ PASS    ] game_escrow::escrow::test_create_and_join_game
[ PASS    ] game_escrow::escrow::test_creator_cannot_join_own_game
[ PASS    ] game_escrow::escrow::test_finish_game_player1_wins
[ PASS    ] game_escrow::escrow::test_wrong_entry_amount
Test result: OK. Total tests: 6; passed: 6; failed: 0
```

#### 6. Deploy to Testnet

```bash
one client publish --gas-budget 50000000
```

**Save the Package ID** from the output:
```
╭─────────────────────────────────────────────────────╮
│ Published Objects:                                  │
│  ┌──                                                │
│  │ PackageID: 0x123abc...                          │  ← COPY THIS
│  │ Version: 1                                       │
│  │ Digest: <hash>                                   │
│  │ Modules: escrow                                  │
│  └──                                                │
╰─────────────────────────────────────────────────────╯
```

#### 7. Update Frontend Configuration

Update `.env.local` with your Package ID:
```env
NEXT_PUBLIC_PACKAGE_ID=0x123abc...  # Your actual package ID
```

#### 8. Switch Networks (Optional)

**For Mainnet Deployment:**
```bash
# Add mainnet environment
one client new-env --alias mainnet --rpc https://rpc-mainnet.onelabs.cc:443

# Switch to mainnet
one client switch --env mainnet

# Deploy (requires real OCT tokens)
one client publish --gas-budget 50000000
```

**Switch back to Testnet:**
```bash
one client switch --env testnet
```

#### 9. View Deployed Contract

Check your deployment on the explorer:
```
https://explorer.onelabs.cc/object/YOUR_PACKAGE_ID?network=testnet
```

---

## 💻 Usage

### For Players

#### 1. **Connect Wallet**
- Visit the application
- Click "Connect Wallet"
- Approve connection in your OneChain wallet

#### 2. **Create a Game**
- Click "Create Game"
- Set entry amount (in OCT)
- Confirm transaction
- Share game ID with opponent

#### 3. **Join a Game**
- Enter game ID
- Click "Join Game"
- Match the entry amount
- Confirm transaction

#### 4. **Play & Win**
- Complete the game
- Winner is determined
- Prize automatically sent to winner's wallet

### For Developers

#### Integrate with Your Frontend

```typescript
import { SuiClient } from '@onelabs/sui/client';
import { createGame, joinGame, finishGame } from './lib/escrow';

// Initialize client
const client = new SuiClient({ 
  url: 'https://rpc-testnet.onelabs.cc:443' 
});

// Create game
const result = await createGame(client, playerKeypair);

// Join game
await joinGame(client, player2Keypair, gameId);

// Finish game
await finishGame(client, anyPlayerKeypair, gameId, winnerAddress);
```

#### Query Game State

```typescript
import { getGameState } from './lib/escrow';

const gameState = await getGameState(client, gameId);
console.log(gameState);
```

#### Listen to Events

```typescript
const events = await client.queryEvents({
  query: {
    MoveModule: {
      package: PACKAGE_ID,
      module: 'escrow',
    },
  },
});
```

---

## 📜 Smart Contract Details

### Module: `game_escrow::escrow`

#### Structs

**GameEscrow**
```move
public struct GameEscrow has key {
    id: UID,
    entry_amount: u64,        // Required entry per player
    player1: address,          // Creator address
    player2: Option<address>,  // Joiner address
    balance: Coin<OCT>,        // Escrowed tokens
    status: u8,                // 0=waiting, 1=ready, 2=finished
    winner: Option<address>,   // Winner address
}
```

#### Functions

| Function | Description | Access |
|----------|-------------|--------|
| `create_game` | Create new game and deposit entry | Public |
| `join_game` | Join existing game with deposit | Public |
| `finish_game` | Declare winner and distribute prize | Players only |
| `cancel_game` | Cancel game and get refund | Creator only |
| `get_*` | View functions for game state | Public |

#### Events

**GameCreated**
```move
{
  game_id: ID,
  creator: address,
  entry_amount: u64
}
```

**PlayerJoined**
```move
{
  game_id: ID,
  player: address
}
```

**GameFinished**
```move
{
  game_id: ID,
  winner: address,
  prize_amount: u64
}
```

#### Error Codes

| Code | Name | Description |
|------|------|-------------|
| 0 | `EInvalidAmount` | Entry amount mismatch |
| 1 | `EGameNotReady` | Both players not joined |
| 2 | `EGameAlreadyFull` | Cannot join full game |
| 3 | `EPlayerAlreadyJoined` | Creator cannot join own game |
| 4 | `ENotGameParticipant` | Only players can finish |
| 5 | `EGameNotFinished` | Game still in progress |
| 6 | `EGameAlreadyFinished` | Game already completed |

---

## 📁 Project Structure

```
One-Game/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── game/                    # Game pages
│       ├── create/
│       ├── join/
│       └── play/
├── components/                   # React components
│   ├── game/
│   │   ├── CreateGame.tsx
│   │   ├── JoinGame.tsx
│   │   └── GameBoard.tsx
│   ├── wallet/
│   │   └── WalletConnect.tsx
│   └── ui/                      # Reusable UI components
├── lib/                         # Utility functions
│   ├── escrow.ts               # Smart contract interactions
│   ├── onechain.ts             # OneChain SDK setup
│   └── utils.ts                # Helper functions
├── game_escrow/                 # Smart contract project
│   ├── Move.toml               # Package manifest
│   ├── sources/
│   │   └── escrow.move         # Main contract
│   └── tests/                  # Move tests
├── public/                      # Static assets
├── styles/                      # Global styles
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Smart contract development
- [x] Basic UI/UX
- [x] Wallet integration
- [x] Testnet deployment

### Phase 2: Enhanced Features 🚧
- [ ] Multiple game types
- [ ] Tournament mode
- [ ] Leaderboards
- [ ] Game history

### Phase 3: Advanced Capabilities 📋
- [ ] Gas-sponsored transactions
- [ ] Multi-token support
- [ ] Mobile application
- [ ] Social features

### Phase 4: Scaling & Optimization 💡
- [ ] Mainnet deployment
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Developer API

### Future Enhancements
- [ ] DAO governance
- [ ] Staking pools
- [ ] NFT integration
- [ ] Cross-chain support

See the [open issues](https://github.com/Isaac-Kingsley007/One-Game/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   ```bash
   gh repo fork Isaac-Kingsley007/One-Game
   ```

2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Write clean, documented code
- Add tests for new features
- Update documentation
- Follow the existing code style
- Test on testnet before mainnet

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Isaac Kingsley** - Project Lead

- GitHub: [@Isaac-Kingsley007](https://github.com/Isaac-Kingsley007)
- Project Link: [https://github.com/Isaac-Kingsley007/One-Game](https://github.com/Isaac-Kingsley007/One-Game)

### Community

- Discord: [Join our community](#)
- Twitter: [@OneGame](#)
- Documentation: [docs.onegame.io](#)

---

## 🙏 Acknowledgments

Special thanks to:

- **[OneChain Labs](https://onelabs.cc/)** - For the OneChain blockchain platform
- **[Move Language](https://move-book.com/)** - For the secure smart contract language
- **[Next.js Team](https://nextjs.org/)** - For the amazing React framework
- **Community Contributors** - For testing and feedback

### Resources Used

- [OneChain Documentation](https://docs.onelabs.cc/)
- [Move Language Book](https://move-book.com/)
- [Sui Documentation](https://docs.sui.io/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🔒 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please send an email to security@onegame.io. **Do not** create a public issue.

### Smart Contract Security

- All smart contracts are tested extensively
- Audits: [View audit reports](./audits)
- Bug Bounty: [Learn more](./SECURITY.md)

---

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/Isaac-Kingsley007/One-Game?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Isaac-Kingsley007/One-Game?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Isaac-Kingsley007/One-Game)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Isaac-Kingsley007/One-Game)

---

<div align="center">

**Built with ❤️ on OneChain**

[Website](#) · [Documentation](#) · [Twitter](#) · [Discord](#)

</div>

---

## 📚 Additional Resources

### Tutorials
- [Getting Started with One Game](./docs/tutorials/getting-started.md)
- [Deploying Your First Game](./docs/tutorials/deployment.md)
- [Smart Contract Deep Dive](./docs/tutorials/smart-contracts.md)

### API Documentation
- [Frontend API Reference](./docs/api/frontend.md)
- [Smart Contract API](./docs/api/smart-contract.md)
- [Event System](./docs/api/events.md)

### Examples
- [Simple Two-Player Game](./examples/simple-game)
- [Tournament Mode](./examples/tournament)
- [Custom Game Logic](./examples/custom-logic)

---

## 💪 Powered By

<div align="center">

[![OneChain](https://img.shields.io/badge/OneChain-Blockchain-blue?style=for-the-badge)](https://onelabs.cc/)
[![Move](https://img.shields.io/badge/Move-Smart_Contracts-orange?style=for-the-badge)](https://move-book.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-black?style=for-the-badge)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-blue?style=for-the-badge)](https://www.typescriptlang.org/)

</div>

---

**Made with 💙 by the One Game Team**