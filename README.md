# Kierunek Dzierganie - Monorepo

This is a monorepo containing the Kierunek Dzierganie platform consisting of:

## Structure

```
kierunek-dzierganie/
├── next/              # Next.js frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── sanity/            # Sanity CMS (to be added)
└── package.json       # Root package with workspaces
```

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- Node.js 18+

### Installation

```bash
# Install all dependencies
bun install

# Install dependencies for specific workspace
bun install --filter next
bun install --filter sanity
```

### Development

```bash
# Run frontend only
bun dev

# Run Sanity CMS only (when added)
bun dev:sanity

# Run both simultaneously
bun dev:all
```

### Building

```bash
# Build frontend
bun build

# Build Sanity (when added)
bun build:sanity

# Build all
bun build:all
```

## Workspaces

This project uses Bun workspaces to manage multiple packages:

- **next/**: Next.js frontend application
- **sanity/**: Sanity CMS project (to be added)

## Scripts

- `bun dev` - Start Next.js development server
- `bun dev:sanity` - Start Sanity development server
- `bun dev:all` - Start both development servers
- `bun build` - Build Next.js application
- `bun build:sanity` - Build Sanity project
- `bun build:all` - Build all projects
- `bun lint` - Run ESLint on Next.js project
- `bun template` - Generate component templates

## Contributing

1. Work in the appropriate workspace directory
2. Follow the existing code style
3. Run tests before committing
4. Create pull requests for review

## License

Private project - All rights reserved.
