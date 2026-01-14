-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- Create custom types
create type task_status as enum ('backlog', 'todo', 'in_progress', 'review', 'done', 'archived');
create type task_priority as enum ('low', 'medium', 'high', 'urgent');
create type knowledge_item_type as enum ('document', 'voice_note', 'snippet', 'web_clip');
create type workflow_status as enum ('draft', 'active', 'paused', 'archived');
create type execution_status as enum ('pending', 'running', 'completed', 'failed', 'cancelled');

-- Users table (extends Supabase auth.users)
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Style profile for AI learning
create table public.style_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  writing_style jsonb default '{}'::jsonb,
  vocabulary_patterns jsonb default '{}'::jsonb,
  management_preferences jsonb default '{}'::jsonb,
  tone_analysis jsonb default '{}'::jsonb,
  sample_count integer default 0,
  last_analyzed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Knowledge base items
create table public.knowledge_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  title text not null,
  content text,
  item_type knowledge_item_type not null,
  file_path text,
  file_size bigint,
  mime_type text,
  transcription text,
  summary text,
  tags text[] default array[]::text[],
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536), -- OpenAI ada-002 embedding size
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for vector similarity search
create index knowledge_items_embedding_idx on public.knowledge_items
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  title text not null,
  description text,
  status task_status default 'backlog' not null,
  priority task_priority default 'medium' not null,
  ai_priority_score numeric(5,2), -- AI-calculated priority (0-100)
  due_date timestamp with time zone,
  start_date timestamp with time zone,
  estimated_hours numeric(6,2),
  actual_hours numeric(6,2),
  completed_at timestamp with time zone,
  tags text[] default array[]::text[],
  metadata jsonb default '{}'::jsonb, -- Custom fields
  parent_task_id uuid references public.tasks(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Task dependencies (many-to-many)
create table public.task_dependencies (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  depends_on_task_id uuid references public.tasks(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(task_id, depends_on_task_id),
  check (task_id != depends_on_task_id)
);

-- Workflows
create table public.workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  name text not null,
  description text,
  status workflow_status default 'draft' not null,
  definition jsonb not null, -- Workflow DAG definition
  trigger_config jsonb, -- Trigger configuration
  version integer default 1 not null,
  is_template boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Workflow executions
create table public.workflow_executions (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  status execution_status default 'pending' not null,
  input_data jsonb,
  output_data jsonb,
  error_message text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Integrations
create table public.integrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  service_name text not null, -- jira, slack, notion, etc.
  display_name text,
  credentials jsonb, -- Encrypted OAuth tokens, API keys
  config jsonb default '{}'::jsonb,
  is_active boolean default true,
  last_sync_at timestamp with time zone,
  sync_status text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, service_name)
);

-- Activity log
create table public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  entity_type text not null, -- task, workflow, knowledge_item, etc.
  entity_id uuid not null,
  action text not null, -- created, updated, deleted, etc.
  changes jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index idx_user_profiles_id on public.user_profiles(id);
create index idx_knowledge_items_user_id on public.knowledge_items(user_id);
create index idx_knowledge_items_item_type on public.knowledge_items(item_type);
create index idx_knowledge_items_tags on public.knowledge_items using gin(tags);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_priority on public.tasks(priority);
create index idx_tasks_due_date on public.tasks(due_date);
create index idx_tasks_tags on public.tasks using gin(tags);
create index idx_workflows_user_id on public.workflows(user_id);
create index idx_workflow_executions_workflow_id on public.workflow_executions(workflow_id);
create index idx_workflow_executions_status on public.workflow_executions(status);
create index idx_integrations_user_id on public.integrations(user_id);
create index idx_activity_log_user_id on public.activity_log(user_id);
create index idx_activity_log_entity on public.activity_log(entity_type, entity_id);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger set_updated_at before update on public.user_profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.style_profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.knowledge_items
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.tasks
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.workflows
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.integrations
  for each row execute function public.handle_updated_at();

-- Create function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.style_profiles (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable Row Level Security
alter table public.user_profiles enable row level security;
alter table public.style_profiles enable row level security;
alter table public.knowledge_items enable row level security;
alter table public.tasks enable row level security;
alter table public.task_dependencies enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_executions enable row level security;
alter table public.integrations enable row level security;
alter table public.activity_log enable row level security;

-- RLS Policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- RLS Policies for style_profiles
create policy "Users can view their own style profile"
  on public.style_profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own style profile"
  on public.style_profiles for update
  using (auth.uid() = user_id);

-- RLS Policies for knowledge_items
create policy "Users can view their own knowledge items"
  on public.knowledge_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own knowledge items"
  on public.knowledge_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own knowledge items"
  on public.knowledge_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own knowledge items"
  on public.knowledge_items for delete
  using (auth.uid() = user_id);

-- RLS Policies for tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- RLS Policies for task_dependencies
create policy "Users can view dependencies of their tasks"
  on public.task_dependencies for select
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = task_dependencies.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can manage dependencies of their tasks"
  on public.task_dependencies for all
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = task_dependencies.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- RLS Policies for workflows
create policy "Users can view their own workflows"
  on public.workflows for select
  using (auth.uid() = user_id or is_template = true);

create policy "Users can insert their own workflows"
  on public.workflows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own workflows"
  on public.workflows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own workflows"
  on public.workflows for delete
  using (auth.uid() = user_id);

-- RLS Policies for workflow_executions
create policy "Users can view their own workflow executions"
  on public.workflow_executions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own workflow executions"
  on public.workflow_executions for insert
  with check (auth.uid() = user_id);

-- RLS Policies for integrations
create policy "Users can view their own integrations"
  on public.integrations for select
  using (auth.uid() = user_id);

create policy "Users can manage their own integrations"
  on public.integrations for all
  using (auth.uid() = user_id);

-- RLS Policies for activity_log
create policy "Users can view their own activity"
  on public.activity_log for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activity"
  on public.activity_log for insert
  with check (auth.uid() = user_id);

-- Helper function for semantic search
create or replace function match_knowledge_items(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id uuid
)
returns table (
  id uuid,
  title text,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_items.id,
    knowledge_items.title,
    knowledge_items.content,
    1 - (knowledge_items.embedding <=> query_embedding) as similarity
  from public.knowledge_items
  where knowledge_items.user_id = filter_user_id
    and 1 - (knowledge_items.embedding <=> query_embedding) > match_threshold
  order by knowledge_items.embedding <=> query_embedding
  limit match_count;
end;
$$;
