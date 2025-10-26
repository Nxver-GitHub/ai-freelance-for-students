-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  user_type text not null check (user_type in ('student', 'startup')),
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create student_profiles table for student-specific data
create table if not exists public.student_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  bio text,
  school text,
  graduation_year integer,
  skills text[], -- Array of skills
  github_url text,
  linkedin_url text,
  portfolio_url text,
  theme_preference text default 'default',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create startup_profiles table for startup-specific data
create table if not exists public.startup_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  company_description text,
  company_website text,
  yc_batch text, -- e.g., "W24", "S23"
  company_size text,
  industry text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create projects table for student projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null,
  description text,
  tech_stack text[], -- Array of technologies
  github_url text,
  demo_url text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create voice_portfolios table for voice recordings
create table if not exists public.voice_portfolios (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  audio_url text not null,
  transcript text,
  duration_seconds integer,
  ai_analysis jsonb, -- Store AI-generated insights
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create job_postings table for startup opportunities
create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startup_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_skills text[],
  job_type text check (job_type in ('internship', 'full-time', 'contract', 'part-time')),
  location text,
  is_remote boolean default false,
  compensation_range text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create applications table for student applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  job_posting_id uuid not null references public.job_postings(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'reviewed', 'interview', 'accepted', 'rejected')),
  cover_letter text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(student_id, job_posting_id) -- Prevent duplicate applications
);

-- Create messages table for real-time messaging
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.startup_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.voice_portfolios enable row level security;
alter table public.job_postings enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- RLS Policies for profiles
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for student_profiles
create policy "Anyone can view student profiles"
  on public.student_profiles for select
  using (true);

create policy "Students can update their own profile"
  on public.student_profiles for update
  using (auth.uid() = id);

create policy "Students can insert their own profile"
  on public.student_profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for startup_profiles
create policy "Anyone can view startup profiles"
  on public.startup_profiles for select
  using (true);

create policy "Startups can update their own profile"
  on public.startup_profiles for update
  using (auth.uid() = id);

create policy "Startups can insert their own profile"
  on public.startup_profiles for insert
  with check (auth.uid() = id);

-- RLS Policies for projects
create policy "Anyone can view projects"
  on public.projects for select
  using (true);

create policy "Students can manage their own projects"
  on public.projects for all
  using (auth.uid() = student_id);

-- RLS Policies for voice_portfolios
create policy "Anyone can view voice portfolios"
  on public.voice_portfolios for select
  using (true);

create policy "Students can manage their own voice portfolios"
  on public.voice_portfolios for all
  using (auth.uid() = student_id);

-- RLS Policies for job_postings
create policy "Anyone can view active job postings"
  on public.job_postings for select
  using (is_active = true or auth.uid() = startup_id);

create policy "Startups can manage their own job postings"
  on public.job_postings for all
  using (auth.uid() = startup_id);

-- RLS Policies for applications
create policy "Students can view their own applications"
  on public.applications for select
  using (auth.uid() = student_id);

create policy "Startups can view applications to their jobs"
  on public.applications for select
  using (
    exists (
      select 1 from public.job_postings
      where job_postings.id = applications.job_posting_id
      and job_postings.startup_id = auth.uid()
    )
  );

create policy "Students can create applications"
  on public.applications for insert
  with check (auth.uid() = student_id);

create policy "Startups can update application status"
  on public.applications for update
  using (
    exists (
      select 1 from public.job_postings
      where job_postings.id = applications.job_posting_id
      and job_postings.startup_id = auth.uid()
    )
  );

-- RLS Policies for messages
create policy "Users can view their own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Recipients can mark messages as read"
  on public.messages for update
  using (auth.uid() = recipient_id);

-- RLS Policies for notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_profiles_user_type on public.profiles(user_type);
create index if not exists idx_projects_student_id on public.projects(student_id);
create index if not exists idx_voice_portfolios_student_id on public.voice_portfolios(student_id);
create index if not exists idx_job_postings_startup_id on public.job_postings(startup_id);
create index if not exists idx_job_postings_is_active on public.job_postings(is_active);
create index if not exists idx_applications_student_id on public.applications(student_id);
create index if not exists idx_applications_job_posting_id on public.applications(job_posting_id);
create index if not exists idx_messages_sender_id on public.messages(sender_id);
create index if not exists idx_messages_recipient_id on public.messages(recipient_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
