# Task Automation Platform - Setup Guide

This guide will walk you through setting up the Task Automation Platform locally and deploying to production.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))
- **Supabase CLI** installed globally

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

## Step 2: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd task-automation-platform

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Set Up Supabase Project

### Option A: Local Development (Recommended for Getting Started)

1. **Start local Supabase instance:**
   ```bash
   cd backend
   supabase start
   ```

   This will start Docker containers for:
   - PostgreSQL database
   - Supabase Studio (UI)
   - Auth server
   - Storage server
   - Realtime server

2. **Note the credentials:** After starting, you'll see output like:
   ```
   API URL: http://localhost:54321
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   Studio URL: http://localhost:54323
   anon key: eyJh...
   service_role key: eyJh...
   ```

3. **Copy these credentials** - you'll need them for environment variables

### Option B: Supabase Cloud (Recommended for Production)

1. **Create a new project:**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Fill in project details
   - Choose a region close to your users
   - Wait for project to initialize (~2 minutes)

2. **Get your credentials:**
   - Go to Project Settings > API
   - Copy your Project URL and anon/public API key

3. **Link local project to cloud:**
   ```bash
   cd backend
   supabase login
   supabase link --project-ref your-project-ref
   ```

## Step 4: Run Database Migrations

```bash
# From the backend directory
cd backend

# Run migrations
supabase db reset  # This runs all migrations

# Or manually:
supabase migration up
```

This will:
- Create all database tables
- Set up Row Level Security policies
- Create storage buckets
- Enable pgvector extension
- Set up triggers and functions

## Step 5: Configure Environment Variables

### Frontend Environment Variables

Create `.env.local` in the `frontend` directory:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For Local Development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key

# For Production (Supabase Cloud)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key

# Optional: AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Edge Functions Environment Variables

Create `.env` in `backend/supabase/functions/.env`:

```bash
cd backend/supabase/functions
cat > .env << EOF
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
EOF
```

## Step 6: Start Development Server

```bash
# Terminal 1: Start Supabase (if using local)
cd backend
supabase start

# Terminal 2: Start Next.js frontend
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 7: Test the Setup

1. **Access Supabase Studio:**
   - Local: http://localhost:54323
   - Cloud: https://app.supabase.com/project/your-project

2. **Check database tables:**
   - Go to Table Editor
   - You should see: user_profiles, tasks, knowledge_items, workflows, etc.

3. **Test authentication:**
   - Go to http://localhost:3000
   - Click "Get Started"
   - Create a test account

4. **Verify user creation:**
   - Check Supabase Studio > Authentication > Users
   - Your test user should appear
   - Check Table Editor > user_profiles (should have a row)

## Step 8: Deploy Edge Functions (Optional)

If you want to use AI features:

```bash
cd backend

# Deploy all functions
supabase functions deploy analyze-style
supabase functions deploy prioritize-tasks
supabase functions deploy process-file

# Or deploy all at once
supabase functions deploy
```

## Step 9: Deploy to Production

### Deploy Frontend (Vercel)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial platform setup"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `frontend`

3. **Configure environment variables in Vercel:**
   - Add all variables from `.env.local`
   - Use your Supabase Cloud credentials

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### Deploy Backend (Supabase Cloud)

Already done if you used Supabase Cloud! Just ensure:

1. **Migrations are applied:**
   ```bash
   supabase db push
   ```

2. **Edge functions are deployed:**
   ```bash
   supabase functions deploy
   ```

3. **Storage buckets are configured:**
   - Should be created by migrations
   - Verify in Dashboard > Storage

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Make sure you've created `.env.local` in the frontend directory with correct values.

### Issue: Tables don't exist

**Solution:** Run migrations:
```bash
cd backend
supabase db reset
```

### Issue: Can't connect to local Supabase

**Solution:**
1. Make sure Docker is running
2. Stop and restart: `supabase stop && supabase start`

### Issue: Edge functions failing

**Solution:**
1. Check function logs: `supabase functions logs function-name`
2. Verify environment variables are set
3. Test locally: `supabase functions serve function-name`

### Issue: File uploads failing

**Solution:**
1. Check storage policies in migrations
2. Verify buckets exist in Dashboard > Storage
3. Check file size limits and MIME types

### Issue: Authentication not working

**Solution:**
1. Verify `site_url` in Supabase dashboard (Auth > URL Configuration)
2. Add redirect URLs for your domain
3. Check CORS settings

## Next Steps

Now that your platform is set up:

1. **Customize the schema:** Add custom fields to `tasks` metadata
2. **Build UI components:** Create task views, knowledge base interface
3. **Integrate AI:** Add OpenAI/Claude API keys and enhance edge functions
4. **Add integrations:** Build plugins for Jira, Slack, etc.
5. **Create workflows:** Design your first automation workflows

## Useful Commands

```bash
# Development
npm run dev                    # Start frontend dev server
supabase start                 # Start local Supabase
supabase stop                  # Stop local Supabase
supabase status                # Check Supabase status

# Database
supabase db reset              # Reset database (destructive!)
supabase db push               # Push migrations to remote
supabase db pull               # Pull remote schema
supabase migration new name    # Create new migration

# Edge Functions
supabase functions new name        # Create new function
supabase functions serve name      # Test function locally
supabase functions deploy name     # Deploy function
supabase functions logs name       # View function logs

# Production
npm run build                  # Build for production
npm start                      # Start production server
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs in Dashboard
3. Check browser console for frontend errors
4. Review edge function logs with `supabase functions logs`

## Security Checklist

Before going to production:

- [ ] Enable email confirmation in Supabase Auth settings
- [ ] Set up proper CORS origins
- [ ] Review and test all RLS policies
- [ ] Enable rate limiting on edge functions
- [ ] Set up monitoring and alerting
- [ ] Review storage bucket permissions
- [ ] Secure API keys (never commit to git)
- [ ] Set up database backups
- [ ] Configure custom domain with SSL
- [ ] Enable 2FA for Supabase account
