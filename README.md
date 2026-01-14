# Task Automation Platform

A modular task automation platform designed for Product/Project Managers to automate daily work, prioritize tasks, and build custom workflows.

## Features

### Core Capabilities
- **Knowledge Base**: Upload documents and voice notes to build your personalized knowledge repository
- **AI Style Learning**: Platform learns your writing and management style
- **Smart Task Management**: AI-powered task prioritization and recommendations
- **Workflow Automation**: Build custom workflows with visual builder
- **Integrations**: Connect with Jira, Slack, Notion, and more
- **Voice Input**: Transcribe voice notes and meetings
- **File Upload**: Support for PDF, DOCX, TXT, MD, CSV

### Technical Highlights
- **Modern Stack**: Next.js, Supabase, TypeScript
- **Real-time Updates**: Live collaboration and notifications
- **Secure**: Row-level security, JWT authentication
- **Scalable**: Serverless architecture with edge functions
- **Extensible**: Plugin-based workflow system

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical architecture.

## Project Structure

```
.
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # Next.js 14 app directory
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and helpers
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
│
├── backend/              # Supabase backend
│   ├── supabase/
│   │   ├── migrations/   # Database migrations
│   │   ├── functions/    # Edge functions
│   │   └── config.toml   # Supabase configuration
│   └── seed/             # Seed data
│
└── docs/                 # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase CLI
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-automation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

   # Initialize Supabase (if not already initialized)
   cd backend
   supabase init

   # Start local Supabase instance
   supabase start
   ```

4. **Configure environment variables**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_key (optional)
   ANTHROPIC_API_KEY=your_anthropic_key (optional)
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Connecting to Supabase Cloud

To use Supabase cloud instead of local instance:

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Update your `.env.local` file
4. Link your local project:
   ```bash
   cd backend
   supabase link --project-ref your-project-ref
   ```
5. Push migrations to cloud:
   ```bash
   supabase db push
   ```

## Development

### Database Migrations

Create a new migration:
```bash
npm run db:new-migration migration_name
```

Apply migrations:
```bash
npm run db:migrate
```

Reset database (caution: destroys data):
```bash
npm run db:reset
```

### Edge Functions

Create a new edge function:
```bash
cd backend
supabase functions new function-name
```

Deploy edge function:
```bash
supabase functions deploy function-name
```

### Testing Locally

```bash
# Run frontend tests
cd frontend
npm test

# Run edge function locally
cd backend
supabase functions serve function-name
```

## Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Supabase)

Already deployed when using Supabase cloud. Edge functions deploy via CLI:

```bash
cd backend
supabase functions deploy
```

## Usage Guide

### 1. Upload Knowledge

Navigate to **Knowledge Base** and:
- Upload documents (PDF, DOCX, TXT, MD)
- Record voice notes
- Add snippets manually

The AI will analyze your content to learn your style.

### 2. Manage Tasks

Create tasks with:
- Title and description
- Due dates
- Custom fields
- Tags and categories

AI will automatically prioritize based on:
- Deadlines
- Dependencies
- Historical patterns
- Your preferences

### 3. Build Workflows

Use the workflow builder to:
- Define triggers (time-based, event-based)
- Add actions (create tasks, send notifications)
- Set conditions
- Connect integrations

### 4. Connect Integrations

Link external tools:
- Jira: Sync issues and projects
- Slack: Receive notifications
- Google Calendar: Schedule tasks
- Notion: Import pages

## API Documentation

API documentation is available at:
- Local: http://localhost:54321/rest/v1/
- Cloud: https://your-project.supabase.co/rest/v1/

Supabase automatically generates REST and GraphQL APIs from your database schema.

## Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Roadmap

- [x] Project setup and architecture
- [ ] Database schema and migrations
- [ ] Authentication flow
- [ ] File upload system
- [ ] Voice transcription
- [ ] Knowledge base UI
- [ ] Task management CRUD
- [ ] AI prioritization
- [ ] Workflow engine
- [ ] Visual workflow builder
- [ ] Integration framework
- [ ] Dashboard and analytics
- [ ] Mobile responsiveness
- [ ] Dark mode

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
