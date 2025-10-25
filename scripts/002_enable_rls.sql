-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Student profiles policies
CREATE POLICY "Anyone can view student profiles" ON public.student_profiles FOR SELECT USING (true);
CREATE POLICY "Students can update own profile" ON public.student_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Students can insert own profile" ON public.student_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Startup profiles policies
CREATE POLICY "Anyone can view startup profiles" ON public.startup_profiles FOR SELECT USING (true);
CREATE POLICY "Startups can update own profile" ON public.startup_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Startups can insert own profile" ON public.startup_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Portfolios policies
CREATE POLICY "Anyone can view published portfolios" ON public.portfolios FOR SELECT USING (is_published = true OR auth.uid() = student_id);
CREATE POLICY "Students can create own portfolios" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own portfolios" ON public.portfolios FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Students can delete own portfolios" ON public.portfolios FOR DELETE USING (auth.uid() = student_id);

-- Projects policies
CREATE POLICY "Anyone can view open projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Startups can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = startup_id);
CREATE POLICY "Startups can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = startup_id);
CREATE POLICY "Startups can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = startup_id);

-- Applications policies
CREATE POLICY "Users can view applications for their projects or own applications" ON public.applications FOR SELECT USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT startup_id FROM public.projects WHERE id = project_id)
);
CREATE POLICY "Students can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own applications" ON public.applications FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Startups can update applications for their projects" ON public.applications FOR UPDATE USING (
  auth.uid() IN (SELECT startup_id FROM public.projects WHERE id = project_id)
);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON public.messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they received" ON public.messages FOR UPDATE USING (auth.uid() = recipient_id);
