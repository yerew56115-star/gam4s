# Stealth Arcade

A high-performance unblocked game portal with real-time Firestore synchronization.

## Features
- **Real-time Database**: Syncs with Firebase Firestore instantly.
- **Stealth Design**: Professional, technical aesthetic using Tailwind CSS.
- **Management System**: Owner-only game injection and management.
- **Iframe Integration**: Supports direct URLs and embed codes.

## Deployment to GitHub Pages

1. **Build the Project**:
   Run `npm run build`. This will generate a `dist/` folder.
   
2. **Handle Paths**:
   The project is configured with `base: './'` in `vite.config.ts`. This ensures that assets are loaded correctly regardless of whether the app is hosted at the root or a subfolder.

3. **Deploy Artifacts**:
   Upload the contents of the `dist/` folder to your GitHub repository's `gh-pages` branch or the root of your deployment branch.

## Configuration

### Firebase Setup
Ensure `firebase-applet-config.json` is present in the root directory. This contains your project's Firebase credentials.

### Owner Access
To manage games, sign in with the Google account associated with the admin email defined in `src/App.tsx`.

## Development
```bash
npm install
npm run dev
```
