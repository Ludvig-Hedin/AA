# Deployment Guide

This guide explains how to deploy the AI Assistant with Browser Control to GitHub and Vercel.

## GitHub Deployment

1. **Initialize Git Repository (if not already done)**

```bash
git init
```

2. **Add All Files to the Repository**

```bash
git add .
```

3. **Create .gitignore File**

```bash
# Node modules and dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Build outputs
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# System files
.DS_Store
*.pem

# Vercel
.vercel

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg
venv/
.venv/

# AI Server specific
ai-server/.dependencies_installed
ai-server/logs/
```

4. **Commit Changes**

```bash
git commit -m "Implement AI Browser Control integration"
```

5. **Add Remote Repository**

```bash
git remote add origin https://github.com/yourusername/your-repository-name.git
```

6. **Push to GitHub**

```bash
git push -u origin main
```

## Vercel Deployment

1. **Create a Vercel Account**

If you don't already have one, sign up at [vercel.com](https://vercel.com).

2. **Install Vercel CLI (Optional)**

```bash
npm install -g vercel
```

3. **Login to Vercel (Optional)**

```bash
vercel login
```

4. **Configure vercel.json**

Create a `vercel.json` file in the project root:

```json
{
  "name": "ai-assistant-browser-control",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "AI_SERVER_URL": "YOUR_AI_SERVER_URL"
  }
}
```

5. **Deploy to Vercel**

Either using Vercel CLI:

```bash
vercel
```

Or connect your GitHub repository via the Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings
5. Set environment variables (like `AI_SERVER_URL` and `OPENAI_API_KEY`)
6. Deploy

## Deploying the AI Server

The AI server needs to be deployed separately since it's a Python application. Options include:

1. **Heroku**
   
   Create a `Procfile` in the `ai-server` directory:
   ```
   web: uvicorn main:app --host=0.0.0.0 --port=$PORT
   ```
   
   Then deploy to Heroku:
   ```bash
   heroku create
   git subtree push --prefix ai-server heroku main
   ```

2. **Digital Ocean App Platform**

3. **AWS Elastic Beanstalk**

4. **Google Cloud Run**

5. **Self-hosted server** (e.g., VPS)

After deploying the AI server, update the `AI_SERVER_URL` environment variable in your Vercel project to point to the deployed server URL.

## Important Notes

1. **API Keys**: Never commit API keys to your repository. Always use environment variables.

2. **CORS**: Make sure to update the CORS settings in your AI server to allow requests from your Vercel domain.

3. **WebSockets**: If you add WebSocket functionality in the future, ensure your hosting provider supports WebSockets.

4. **Security**: Consider adding authentication to your AI server to prevent unauthorized access. 