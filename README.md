# Stealth Arcade Deployment Guide 🚀

If you are seeing a **white screen**, you are likely uploading the wrong files.

## 1. FIXED: White Screen on GitHub
I have added a **GitHub Action** to your project. 
- When you push your code to GitHub, it will **automatically** build and deploy to GitHub Pages.
- You don't need to manually upload the `dist` folder anymore!

## 2. REPAIR: The "White Screen" (Firebase Config)
If you still see a white screen or can't login, you must add your GitHub URL to the **Authorized Domains** list in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Click **Authentication** in the sidebar.
4. Click the **Settings** tab.
5. Click **Authorized domains** in the left menu.
6. Click **Add domain**.
7. **Add this text to the list:** `yourname.github.io` (replace `yourname` with your GitHub username).
8. Also add: `ais-pre-ejrbjgsu46hhhe5x4yo6ir-73254087064.us-east1.run.app`

## 3. Deployment Steps
1. Push this code to a GitHub repository.
2. Go to **Settings** -> **Pages** in your GitHub Repo.
3. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
4. The site will deploy automatically!

## Library Contents
Your project contains:
- `src/main.tsx`: The initialization logic.
- `src/App.tsx`: The main user interface and game logic.
- `src/firebase-applet-config.json`: Your technical credentials.
- `index.html`: The entry point with a built-in error scanner.

