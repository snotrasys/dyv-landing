# D&V Group Blockchain - AI Agent Guide

This document provides essential information about the **D&V Group Blockchain** (internal name: `biotic`) landing page project for AI coding agents.

---

## Project Overview

**D&V Group Blockchain** is a Next.js-based landing page for a cryptocurrency project focused on:
- Real estate tokenization
- Renewable energy investment
- Decentralized financial services (DeFi)
- Community development through Web 3.0

The application includes a marketing landing page, token presale functionality, airdrop claiming, vesting dashboards, and admin tools for managing token distributions.

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (Pages Router) |
| React | 18.3.1 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 3.4 |
| Animations | Framer Motion |
| Web3 | Ethers.js v5 + Web3Modal v4 |
| State Management | React Context API |
| HTTP Client | Axios |
| Icons | Heroicons, Lucide React |
| UI Components | Headless UI |
| Notifications | React Hot Toast |

### Supported Blockchains
- **Base** (Primary)
- **opBNB** (Secondary)

---

## Project Structure

```
src/
├── pages/                    # Next.js pages (file-based routing)
│   ├── _app.jsx             # App wrapper with providers
│   ├── index.jsx            # Landing page (main entry)
│   ├── presale.jsx          # Token presale page
│   ├── presale-roi.jsx      # ROI presale interface
│   ├── Airdropdyv.jsx       # Airdrop claiming page
│   ├── vesting-users.jsx    # Vesting dashboard for users
│   ├── panel-admin.jsx      # Admin panel for vesting management
│   ├── blessing.jsx         # Blessing/referral page
│   └── roadmap.jsx          # Project roadmap display
│
├── components/              # Reusable UI components
│   ├── NavbarMenu.jsx       # Main navigation
│   ├── Sidebar.jsx          # App sidebar
│   ├── Modal.jsx            # Generic modal component
│   ├── FadeIn.jsx           # Scroll-triggered fade animation
│   ├── Price*.jsx           # Token price display components
│   ├── Stake/               # Staking-related components
│   ├── StakeNFT/            # NFT staking components
│   └── icons/               # Custom SVG icons
│
├── views/                   # Page sections and complex views
│   ├── FeaturesSection.jsx  # Landing page features
│   ├── CardSliderSection.jsx# Card carousel section
│   ├── Footer.jsx           # Site footer
│   ├── Farms/               # Yield farm interfaces
│   ├── Pools/               # Staking pool interfaces
│   └── Prediciones/         # Prediction market UI
│
├── hooks/                   # Custom React hooks
│   ├── useContracts.js      # Smart contract interactions
│   ├── abiHelpers.js        # Contract ABIs
│   ├── UseStake.jsx         # Staking logic
│   ├── UsePresaleVesting.jsx# Presale vesting hooks
│   └── provider.js          # Web3 provider utilities
│
├── context/                 # React Context providers
│   ├── Web3Context.jsx      # Wallet connection state
│   ├── TokenHandle.jsx      # Token balance/approval
│   ├── SpinnerContext.jsx   # Loading state
│   └── MultiApprove.jsx     # Multi-token approval
│
├── services/                # External API services
│   ├── apiService.js        # REST API client
│   └── ipfsService.js       # IPFS interactions
│
├── theme/                   # UI theme configuration
│   ├── theme.jsx            # Chakra UI theme (legacy)
│   └── colors.jsx           # Color palette
│
├── utils/                   # Utility functions
│   ├── utils.js             # General helpers
│   └── LoadingSpinner.jsx   # Loading indicator
│
├── Data/                    # Static data
│   └── countries.js         # Country list for forms
│
└── fonts/                   # Custom font files
    ├── RedThinker-Light.ttf
    └── poppins-v15-latin-*  # Poppins font family
```

---

## Build and Development Commands

```bash
# Install dependencies (choose one)
yarn install
# or
npm install
# or
bun install

# Start development server
yarn dev          # Runs on http://localhost:3000

# Build for production
yarn build        # Creates optimized build in .next/

# Start production server
yarn start        # Serves built application
```

---

## Configuration

### Environment Variables (`.env`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_TITLE` | Site title for SEO |
| `NEXT_PUBLIC_PRODUCT_DESCRIPTION` | Meta description |
| `NEXT_PUBLIC_SEO_KEYWORDS` | SEO keywords |
| `NEXT_PUBLIC_URL` | Production site URL |
| `NEXT_PUBLIC_PARTNER_TWITTER` | Twitter handle |
| `NEXT_PUBLIC_YOUTUBE` | YouTube video URL |
| `NEXT_PUBLIC_INSTAGRAM` | Instagram profile URL |
| `NEXT_PUBLIC_TELEGRAM` | Telegram group link |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL |
| `NEXT_PUBLIC_S3_URL` | S3/storage base URL |
| `NEXT_PUBLIC_IPFS_GATEWAY` | IPFS gateway URL |
| `NEXT_PUBLIC_TOKEN_MASTER_CHEF_v2` | Staking contract address |

### Tailwind Configuration

Custom theme extensions in `tailwind.config.js`:
- **Colors**: `primary: #9900cb`, `secondary: #E6007A`
- **Fonts**: `redthinker`, `primary` (Poppins)
- **Spacing**: `5vw`, `8vw`, `10vw` for responsive margins
- **Height**: `hero: min(60rem, calc(100vh - 10rem))`

### Path Aliases

```javascript
// jsconfig.json
"@/*": ["src/*"]    // Maps @/components to src/components
```

---

## Smart Contract Integration

### Key Contract Addresses (`src/hooks/useContracts.js`)

| Contract | Address | Purpose |
|----------|---------|---------|
| `presaleRoi` | `0x9ea869C059512cd34Ae9Cc077fa6aF367b82dF4D` | Presale with ROI |
| `presaleRoiToken` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Token for presale |
| `stakeRoi` | `0xA39383fE45EFf3B15Db5c97EBd53e92caF974e2C` | Staking contract |
| `claim` | `0x63C33eD515b02f2799ad26698A7d458272EEf962` | Token claim |
| `masterchefv2` | `0x1e511F8C570360eb06A8BE89cdD69f3b080512ae` | MasterChef staking |
| `busd` | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | USDC on Base |

### Web3Modal Configuration

```javascript
// Project ID for WalletConnect
const projectId = '4a7814b39852bee771b4bf431f860455';

// Supported chains: Base, opBNB
chains: [base, opBNB]
```

---

## Code Style Guidelines

### File Naming
- Components: PascalCase (e.g., `NavbarMenu.jsx`)
- Hooks: camelCase with `use` prefix (e.g., `useContracts.js`)
- Pages: camelCase (e.g., `presale-roi.jsx`)
- Utilities: camelCase (e.g., `utils.js`)

### Component Structure
```jsx
// Functional components with arrow functions
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks at top
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // logic
  }, []);
  
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Tailwind CSS Conventions
- Use custom spacing utilities: `5vw`, `8vw`, `10vw`
- Custom colors: `text-primary`, `bg-secondary`
- Responsive prefix order: `sm:`, `md:`, `lg:`, `xl:`
- Dark theme assumed (bg-black, text-white common)

### Import Order
1. React/Next imports
2. Third-party libraries
3. Internal components (`@/components/*`)
4. Hooks (`@/hooks/*`)
5. Context (`@/context/*`)
6. Utils/helpers

---

## Key Features

### 1. Landing Page (`pages/index.jsx`)
- Full-screen video background (responsive: desktop/mobile variants)
- Particle effects with Framer Motion (performance-optimized for mobile)
- Scroll-triggered animations
- Parallax effects on desktop

### 2. Presale (`pages/presale.jsx`, `pages/presale-roi.jsx`)
- Token purchase interface
- Wallet connection required
- Real-time price display
- Referral system integration

### 3. Airdrop (`pages/Airdropdyv.jsx`)
- Claim tokens with vesting
- Linear vesting at 3% daily
- Progress tracking

### 4. Vesting Dashboard (`pages/vesting-users.jsx`)
- User vesting schedule display
- Claim functionality
- Token balance tracking

### 5. Admin Panel (`pages/panel-admin.jsx`)
- Create new vesting schedules
- Manage beneficiaries
- View global statistics
- Revoke vestings

---

## API Integration

### Base API URL
```javascript
// src/services/apiService.js
baseURL: 'https://bm.api.magic-api.net/v1'
```

### Authentication
Uses Bearer token from `localStorage.getItem('token')`

---

## Performance Considerations

### Animation Optimizations (in `index.jsx`)
- Reduced particle count on mobile (15 vs 75)
- Connection lines disabled on mobile
- Throttled mouse position updates (50ms)
- `will-change` and `transform` for GPU acceleration
- Reduced motion support via `MotionConfig`

### Image Optimization
- Custom S3 domain configured in `next.config.js`
- External images hosted at `minio-s3.caprover.snotrasys.com`

---

## Security Considerations

1. **Never commit `.env` files** with real values
2. **Contract addresses** are hardcoded but should be verified before mainnet deployment
3. **Token approvals** handled through `MultiApprove` context
4. **Wallet connection** validated before transactions
5. **Error handling** via toast notifications

---

## Integration Documentation

The project includes detailed integration guides:

- `integracion.md` - DYV_V2 Smart Contract integration
- `admin-integracion.md` - MultiTokenVesting admin guide
- `airdrop-integracion.md` - Airdrop contract integration

These documents contain ABI definitions, function signatures, and error handling for smart contract interactions.

---

## Common Issues

### Wallet Connection
- Ensure user is on correct network (Base or opBNB)
- Web3Modal may require refresh if connection fails
- Test wallet address can be set in `Web3Context.jsx`

### Build Errors
- Check Node.js version compatibility (recommend 18+)
- Clear `.next/` cache if build issues persist
- Ensure all environment variables are defined

### Styling Issues
- Tailwind classes must be complete strings (no dynamic class construction)
- Custom fonts loaded via `index.css` and `next.config.js`

---

## Dependencies of Note

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.0.3 | Framework |
| `ethers` | 5.7.2 | Ethereum library |
| `@web3modal/ethers5` | 4.1.11 | Wallet connection |
| `framer-motion` | 11.1.9 | Animations |
| `axios` | 1.6.8 | HTTP client |
| `lucide-react` | 0.474.0 | Icons |
| `react-hot-toast` | 2.4.1 | Notifications |
| `luxon` | 3.5.0 | Date/time handling |

---

## Deployment

The project is configured for static or server-side deployment:

```javascript
// next.config.js
- React StrictMode enabled
- i18n configured (English only)
- Custom image domains allowed
```

Recommended platforms: Vercel, Netlify, or custom Node.js server.
