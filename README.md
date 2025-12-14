## Installation

Follow these steps to get the project running locally.

Prerequisites
- Node.js 18.x or later (LTS recommended). Check with `node -v`.
- A package manager: npm (comes with Node), or yarn, or pnpm.

Clone and checkout the fev2 branch
```bash
git clone https://github.com/YourBoyVoen/Predicteraa.git
cd Predicteraa
git checkout fev2
```

Install dependencies
- Using npm:
```bash
npm install
```
- Using yarn:
```bash
yarn
```
- Using pnpm:
```bash
pnpm install
```

Run the development server
```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev
```
Open http://localhost:5173 (or the URL printed in the terminal).

Build and preview production bundle
```bash
# Build
npm run build

# Preview production build locally
npm run preview
```

Linting and formatting
```bash
# Lint
npm run lint

# Fix auto-fixable lint issues
npm run lint:fix

# Format (if Prettier is configured)
npm run format
```

Environment variables
- If the project requires any environment variables, create a `.env` file at the project root (do not commit secrets).
- Example:
```
VITE_API_URL=https://api.example.com
```
Vite exposes variables prefixed with VITE_ to client code (access with import.meta.env.VITE_API_URL).

Common troubleshooting
- If you see dependency or lockfile issues, try removing node_modules and reinstalling:
```bash
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml
npm install
```
- Ensure Node version >= 18. Use nvm to install/switch Node versions:
```bash
nvm install 18
nvm use 18
```
- If HMR doesn't update, clear the browser cache or restart the dev server.

Optional: Docker (quick example)
- Build image:
```bash
docker build -t predicteraa:dev .
```
- Run container (serving built assets via a simple server):
```bash
docker run -p 5173:5173 predicteraa:dev
```

Notes
- Replace any example environment values with your own secrets and endpoints.
- If you want, I can add this Installation section directly to README.md on the fev2 branch and open a commit — tell me if you want me to proceed.
