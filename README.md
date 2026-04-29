# Stealth Arcade Deployment Guide 🚀

If you are seeing a **white screen**, you are likely uploading the wrong files.

## 1. How to Deploy (FIX WHITE SCREEN)
When you export/download this project, you CANNOT simply upload all the files to GitHub. You must **BUILD** it first:

1. Open a terminal in the project folder.
2. Run `npm install` then `npm run build`.
3. This creates a folder named **`dist`**.
4. **ONLY** upload the contents of the `dist` folder to your GitHub repository.
5. If you see the error "LOAD_ERROR", it means the browser can't find the bundled JavaScript files.

## 2. GitHub Pages Settings
- Go to your GitHub Repo -> **Settings** -> **Pages**.
- Set the source to "Deploy from a branch" (usually `main`).
- Ensure your `index.html` is at the **root** of the branch you are deploying.

## 3. Configuration
Your Firebase credentials are stored in `src/firebase-applet-config.json`. This is automatically included in the build.

