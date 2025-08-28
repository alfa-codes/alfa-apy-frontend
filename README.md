# ALFA APY Frontend

Frontend application for working with ALFA APY strategies on Internet Computer.

## Requirements

- Node.js 18+ 
- npm or yarn
- Internet Computer Agent (for blockchain connection)

## Installing Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

## Environment Variables

The project uses 4 main environment variables for canisters:

- `VITE_VAULT_CANISTER_ID` - vault canister ID
- `VITE_POOL_STATS_CANISTER_ID` - pool stats canister ID  
- `VITE_STRATEGY_HISTORY_CANISTER_ID` - strategy history canister ID
- `VITE_FRONTEND_CANISTER_ID` - frontend canister ID

### Environment Configuration

Create the appropriate .env file depending on the environment:

#### Local Development (.env.local)
```bash
VITE_VAULT_CANISTER_ID=wsic7-jiaaa-aaaad-qhocq-cai
VITE_POOL_STATS_CANISTER_ID=tvneh-raaaa-aaaao-a4opq-cai
VITE_STRATEGY_HISTORY_CANISTER_ID=wcqxd-aaaaa-aaaah-qqe3a-cai
VITE_FRONTEND_CANISTER_ID=kxsds-zqaaa-aaaai-atk3a-cai
```

#### Development (.env.dev)
```bash
VITE_VAULT_CANISTER_ID=wsic7-jiaaa-aaaad-qhocq-cai
VITE_POOL_STATS_CANISTER_ID=tvneh-raaaa-aaaao-a4opq-cai
VITE_STRATEGY_HISTORY_CANISTER_ID=wcqxd-aaaaa-aaaah-qqe3a-cai
VITE_FRONTEND_CANISTER_ID=kxsds-zqaaa-aaaai-atk3a-cai
```

#### Staging (.env.staging)
```bash
VITE_VAULT_CANISTER_ID=ownab-uaaaa-aaaap-qp2na-cai
VITE_POOL_STATS_CANISTER_ID=oxawg-7aaaa-aaaag-aub6q-cai
VITE_STRATEGY_HISTORY_CANISTER_ID=cfd5a-6aaaa-aaaac-a374q-cai
VITE_FRONTEND_CANISTER_ID=47r3x-paaaa-aaaao-qj6ha-cai
```

#### Production (.env.prod)
```bash
VITE_VAULT_CANISTER_ID=ownab-uaaaa-aaaap-qp2na-cai
VITE_POOL_STATS_CANISTER_ID=oxawg-7aaaa-aaaag-aub6q-cai
VITE_STRATEGY_HISTORY_CANISTER_ID=cfd5a-6aaaa-aaaac-a374q-cai
VITE_FRONTEND_CANISTER_ID=47r3x-paaaa-aaaao-qj6ha-cai
```

## Running Locally

### Development Mode
```bash
# Start dev server on port 3001
npm run dev

# Or with yarn
yarn dev
```

The application will be available at: http://localhost:3001

### Build Preview
```bash
# Build the project
npm run build

# Start preview server to view the built project
npm run preview
```

## Building

### Development Build
```bash
# Build with TypeScript checking
npm run build
```

### Building for Different Environments
```bash
# Build for dev environment
npm run build:dev

# Build for staging environment  
npm run build:staging

# Build for production environment
npm run build:prod
```

Built files will be located in the `dist/` folder.

## Deployment

### Automatic Deployment with Correct Environment Variables

The project is configured to automatically switch .env files depending on the dfx network:

```bash
# Deploy to dev network (uses .env.dev)
npm run deploy:dev

# Deploy to staging network (uses .env.staging)  
npm run deploy:staging

# Deploy to mainnet (uses .env.prod)
npm run deploy:ic
```

### Using Bash Script

A bash script is also available for more flexible management:

```bash
# Deploy to dev network
./scripts/deploy.sh dev

# Deploy to staging network
./scripts/deploy.sh staging

# Deploy to mainnet
./scripts/deploy.sh ic
```

The script automatically:
1. Switches .env file depending on the network
2. Builds the project with correct variables
3. Deploys to the specified network with `--mode reinstall` flag
4. Automatically confirms deployment with "yes"
5. Restores the original .env file

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Linting

```bash
# Check code with ESLint
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── idl/                # Canister interfaces
├── interfaces/         # TypeScript interfaces
├── services/           # Business logic and API
├── store/              # Redux store
└── utils/              # Utilities
```

## Main Technologies

- **React 19** - UI library
- **TypeScript** - typed JavaScript
- **Vite** - build tool and dev server
- **Tailwind CSS** - CSS framework
- **Redux Toolkit** - state management
- **@dfinity/agent** - Internet Computer integration

## Connecting to Internet Computer

The application automatically connects to Internet Computer through NFID Identity Kit. Make sure you have the NFID extension or other compatible authentication solution installed.

## Useful Commands

```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force

# Check dependency versions
npm outdated
```
