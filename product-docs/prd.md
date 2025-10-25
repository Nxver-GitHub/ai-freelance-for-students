# BUILDERSYNC PRODUCT REQUIREMENTS DOCUMENT (PRD)
# AI-Powered Student Builder Marketplace - MVP Specification

Version: 1.0
Target Event: Cal Hacks 12.0 (October 24-26, 2025)
Challenge: YC "Rebuild a Company with AI at its Core"
Date: October 2025

---

## EXECUTIVE SUMMARY

BuilderSync is an AI-first marketplace connecting verified student product builders to YC-backed startups for short-term project work. Unlike Fiverr/Upwork, every trust, quality, and payment problem is solved with AI infrastructure at the core, not bolt-on features.

Core Value Propositions:
FOR STUDENTS: AI voice agent converts hackathon projects into verified portfolios; guaranteed payment via smart escrow; career progression pathways; access to real startup work experience
FOR STARTUPS: AI-matched builders in <5 minutes; fraud-proof verification; 24-hour dispute resolution; 92% project completion rate; pre-vetted university talent

Key Differentiators:
- Voice-based portfolio creation (3 min vs 20 min traditional forms)
- Real-time AI verification and credibility scoring
- Built specifically for student → YC startup talent pipeline
- No coding challenges required (focus on conversational AI assessment)

---

## PRODUCT VISION & STRATEGY

### The Problem We're Solving

STUDENT SIDE:
- 68% of first and second-year students have zero internship experience
- Traditional portfolios take 2+ hours to create and often go incomplete
- No trusted pathway from hackathons to real startup work
- Fiverr/Upwork oversaturated with experienced freelancers (students can't compete)

STARTUP SIDE:
- YC companies need affordable builders but can't risk hiring unproven students
- Upwork search takes 2-3 hours on average with 50% poor match rate
- 40% of Fiverr/Upwork projects fail due to skill misrepresentation
- No pipeline specifically for university technical talent

### Our Solution

AI-powered marketplace that:
1. Uses voice AI to convert natural student conversations into professional portfolios
2. Matches students to startups using semantic search and success probability scoring
3. Provides escrow-based payment protection with AI-mediated dispute resolution
4. Creates verified pipeline from CalHacks → YC portfolio companies

### Success Metrics (Post-Hackathon)

User Acquisition: 100 students + 10 startups in first month
Transaction Volume: $50K GMV in 90 days
Match Quality: >85% satisfaction rate
Completion Rate: >90% projects delivered on time
Repeat Rate: >60% of startups hire 2+ times

---

## USER PERSONAS

### Primary Persona 1: STUDENT BUILDER (Supply Side)

Name: Alex Chen
Age: 19, Sophomore at UC Berkeley
Major: Computer Science
Background: Completed 2 hackathons (won 3rd place at CalHacks), no formal internship experience, proficient in React/Node.js/Python, needs resume-worthy experience

Goals:
- Get real project experience to put on resume
- Earn money while building skills
- Connect with startups for future internship/job opportunities
- Build portfolio without spending hours writing

Pain Points:
- Can't compete with experienced freelancers on Upwork
- Doesn't know how to present hackathon projects professionally
- Worried about payment scams or scope creep
- Limited time due to coursework

Motivations:
- Career advancement (70%)
- Financial need (20%)
- Skill development (10%)

Quote: "I've built cool projects but have no idea how to explain them to companies. I just want to talk about what I made and have someone help me package it."

### Primary Persona 2: STARTUP FOUNDER (Demand Side)

Name: Sarah Martinez
Role: Co-founder/CTO at YC W24 SaaS startup
Background: Building MVP, raised $500K seed, team of 3, needs to ship fast but budget-conscious

Goals:
- Find affordable technical help for non-core features
- Hire quickly (within 24 hours) without extensive vetting
- Pay only for results, not hourly uncertainty
- Identify potential future full-time hires

Pain Points:
- Can't afford $150K/year engineer but needs help shipping
- Upwork is hit-or-miss, wastes 3+ hours browsing profiles
- Worried about code quality from unverified students
- Needs someone who understands startup velocity

Motivations:
- Speed to market (40%)
- Cost efficiency (35%)
- Quality assurance (25%)

Quote: "I need a React developer who can ship a clean dashboard in 2 weeks for under $1K. I don't have time to interview 20 people."

---

## CORE FEATURES SPECIFICATION

### FEATURE 1: AI VOICE PORTFOLIO BUILDER (PRIORITY 1 - CRITICAL)

User Story:
"As a student builder, I want to talk naturally about my CalHacks projects so that I can create a professional portfolio without writing long descriptions."

Business Value:
PROBLEM SOLVED: Students struggle to articulate technical projects in portfolio format; 68% abandon profile creation due to writing friction
IMPACT: 10x faster onboarding (2 min vs 20 min traditional forms); 95% profile completion rate
COMPETITIVE ADVANTAGE: First marketplace with conversational onboarding—differentiates from Fiverr's static forms

Technical Implementation:

Tech Stack:
- Vapi Voice AI (Cal Hacks sponsor): Real-time voice conversation interface
- Anthropic Claude 4 (Cal Hacks sponsor): NLP for transcription analysis and portfolio generation
- Groq (Cal Hacks sponsor): Ultra-fast inference for real-time responses
- Letta (Cal Hacks sponsor): Long-term memory to remember context across sessions

User Flow:
1. Student clicks "Create Portfolio with Voice"
2. AI interviewer greets: "Hi! Tell me about your favorite CalHacks project."
3. Student speaks naturally for 2-3 minutes about their project
4. AI asks 8 clarifying questions in real-time:
   - "What's your name and what are you studying?"
   - "Tell me about your favorite project. What did it do?"
   - "What technologies did you use?"
   - "What was the biggest challenge and how did you solve it?"
   - "Were you working alone or with a team? What was your role?"
   - "What impact did your project have? Any metrics?"
   - "Tell me about another project you're proud of."
   - "What kinds of projects excite you most?"
5. AI processes transcript in 10 seconds using Claude
6. Generates structured portfolio with:
   - Project name and 2-3 sentence summary
   - Tech stack (extracted from conversation)
   - Role and contributions
   - Impact metrics
   - Challenges solved
7. Student reviews and can edit before publishing
8. Portfolio saved to Supabase with voice transcript archived

UI/UX Design:

Layout: Full-width centered (max 800px)
Progress Indicator: "Step 1 of 3: Voice Interview"

Section 1: Introduction Card
- Title: "Create Your Portfolio with Voice" (32px bold, Indigo-900)
- Subtitle: "Talk naturally about your projects" (18px, Slate-600)
- Expected time: "3-5 minutes"
- Large primary button: "Start Voice Interview"

Section 2: Voice Interview Interface (appears when started)
- Large circular voice visualizer (256px diameter, Indigo-100 bg)
- Animated waveform when speaking (blue gradient pulse effect)
- Current question displayed above (24px semibold, centered)
- Real-time transcript streaming below (white box, scrollable, max-height 256px)
- Controls:
  - "Start/Pause Recording" (primary button)
  - "Skip Question" (secondary outline button)
  - "Finish Interview" (primary button, appears after question 5)
- Progress bar: "Question 3 of 8" (Indigo-600 fill)

Section 3: Portfolio Preview
- Loading state: "Processing your interview..." (2-3 seconds)
- Generated portfolio card with:
  - Name and university (extracted)
  - "About Me" summary (AI-generated)
  - Skills chips (tech stack extracted)
  - Project cards (name, description, tech, impact)
- Actions:
  - "Add Another Project" (secondary)
  - "Edit" (secondary)
  - "Save & Publish" (primary)

Database Schema:

CREATE TABLE student_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  voice_transcript TEXT NOT NULL,
  ai_generated_summary TEXT,
  projects JSONB DEFAULT '[]'::jsonb,
  skills TEXT[] DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user ON student_portfolios(user_id);
CREATE INDEX idx_portfolios_completion ON student_portfolios(completion_percentage);

Success Metrics:
- Time to complete profile: <3 minutes (target)
- Profile completion rate: >90%
- Student satisfaction (NPS): >50
- Portfolio quality score (founder ratings): >4.5/5
- Transcript processing time: <15 seconds

Edge Cases to Handle:
- Microphone permission denied: Show fallback text form
- Network disconnection mid-interview: Auto-save transcript, allow resume
- AI processing failure: Retry with exponential backoff, show error after 3 attempts
- Student speaks non-English: Detect language, show "English only for now" message
- Incomplete answers: AI prompts "Can you tell me more about [topic]?"
- Profanity or inappropriate content: Flag for human review before publishing

---

### FEATURE 2: AI-POWERED SEMANTIC MATCHING ENGINE (PRIORITY 2)

User Story:
"As a YC founder, I want to find the perfect builder in under 5 minutes without browsing 100 profiles so I can focus on building my product."

Business Value:
PROBLEM SOLVED: Upwork search takes 2-3 hours on average; 50% of matches are poor fit
IMPACT: 95% reduction in time-to-hire; 87% match satisfaction rate
COMPETITIVE ADVANTAGE: Netflix-style recommendations for talent, not keyword search

Technical Implementation:

Tech Stack:
- Unify (Cal Hacks sponsor): Multi-model routing for optimal embedding selection
- Anthropic Claude: Natural language project description parsing
- Pinecone/Weaviate: Vector database for semantic search
- Fetch.ai uAgents (Cal Hacks sponsor): Multi-agent system for complex matching logic

Workflow:

1. PROJECT DESCRIPTION PARSING
When startup posts project, Claude extracts:
{
  "requiredSkills": ["React", "TypeScript", "REST APIs"],
  "projectType": "feature", // mvp | feature | bug_fix | design
  "complexity": "moderate", // simple | moderate | complex
  "timeline": "flexible", // urgent | flexible | long_term
  "budget": 1200,
  "communicationStyle": "async", // async | collaborative
  "mustHave": ["React experience", "Available 10+ hrs/week"],
  "niceToHave": ["Startup experience", "Design sense"]
}

2. EMBEDDING GENERATION
Use Unify to generate optimal embeddings:
- Combines project requirements into semantic vector
- Routes to best model (text-embedding-3-large or gemini-embedding-002)
- Stores in Pinecone for similarity search

3. VECTOR SEARCH FOR CANDIDATES
Query Pinecone with project embedding:
- Returns top 20 builders by cosine similarity
- Filters by availability, credibility score >70
- Considers recency (prioritize active users)

4. MULTI-AGENT RANKING
Fetch.ai agents collaboratively score candidates:

SkillMatchAgent:
- Calculates skill overlap percentage
- Weights by proficiency level
- Accounts for adjacent skills (e.g., Vue.js ≈ React)

AvailabilityAgent:
- Checks hours available per week
- Matches timeline urgency (urgent needs >20 hrs/week)
- Considers timezone alignment

CultureFitAgent:
- Analyzes communication style compatibility
- Compares project description tone to student portfolio tone
- Factors in startup experience mentions

Final score = weighted average of all agents
Top 5 candidates presented to founder

5. SUCCESS PROBABILITY PREDICTION
For each candidate, predict project success likelihood:

Features considered:
- Builder credibility score (0-100)
- Project complexity (1-10 scale)
- Skill match percentage
- Past project completion rate
- Timeline realism (flexible vs urgent)

Output: "87% likely to succeed" displayed on profile card

UI/UX Design:

Startup Views Project Matches:

Header:
"🤖 AI Recommended Builders for '[Project Title]'"
"Top 5 matches based on skills, availability, and past performance"

Builder Card Layout (horizontal card, 800px width):

Left Section (160px):
- Large avatar (128px circle)
- Verification badge (if voice-verified)
- University logo (32px)

Middle Section (flex-grow):
- Name (18px bold) + Year ("Sophomore")
- University (14px, Slate-600)
- Bio (2-3 lines from voice interview, 14px)
- Skills chips (max 6 visible, "+3 more")
- Match percentage: "94% match" (large, Indigo-600, 20px bold)
- Success probability: "87% likely to succeed" (Emerald-600)

Right Section (200px):
- Key match factors:
  "✓ React + TypeScript expertise"
  "✓ Available 15 hrs/week"
  "✓ Startup experience"
- Rate: "$45-65/hr"
- Availability: "Available now" (green dot)
- CTA: "View Full Profile →" (primary button)

Sorting/Filtering:
- Default: "Best Match" (AI score)
- Alt: "Most Available" | "Highest Rated" | "Lowest Rate"
- Filters: Skills | University | Availability

Database Schema:

CREATE TABLE builder_embeddings (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  skills_vector VECTOR(768),
  projects_vector VECTOR(768),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_embedding ON builder_embeddings 
  USING ivfflat (embedding vector_cosine_ops);

CREATE TABLE match_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  builder_id UUID NOT NULL REFERENCES profiles(id),
  match_score DECIMAL(5,2), -- 0-100
  predicted_success_probability INTEGER, -- 0-100
  actual_outcome TEXT, -- 'success' | 'failure' | 'pending'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

Success Metrics:
- Time to first match: <5 seconds
- Match accuracy (founder satisfaction): >85%
- Success probability accuracy: ±10% of actual outcome
- Repeat usage rate: >70%
- Conversion rate (view profile → hire): >25%

Edge Cases:
- No matching builders: Show "Broaden your criteria" suggestions
- All top builders unavailable: Show next-best + estimated availability date
- Tie scores: Prioritize more recent activity
- New builder (no history): Use university reputation + portfolio quality as proxy
- Very specific niche skills: Relax skill matching, show "close matches"

---

### FEATURE 3: PROJECT BROWSING & APPLICATION (PRIORITY 3)

User Story:
"As a student builder, I want to browse available startup projects and apply with a compelling proposal so I can get hired for work that matches my skills."

Business Value:
PROBLEM SOLVED: Students waste hours applying to poorly-matched projects on Upwork
IMPACT: 3x higher acceptance rate due to AI-filtered relevant matches
COMPETITIVE ADVANTAGE: Smart filtering shows only projects student can realistically win

Technical Implementation:

UI/UX Design:

Page Layout: /student/projects

Left Sidebar (280px, collapsible on mobile):
Filters section with clean spacing

PROJECT TYPE:
☐ MVP Development
☐ Feature Addition
☐ Bug Fixing  
☐ Design Work

TECH STACK: (searchable multi-select)
☐ React
☐ Node.js
☐ Python
☐ AI/ML
[+ Show 20 more]

BUDGET RANGE: (slider)
$100 ───●────────── $2500+

TIMELINE:
☐ Urgent (< 1 week)
☐ Flexible (1-4 weeks)
☐ Long-term (1+ months)

COMPANY STAGE:
☐ YC-backed
☐ Seed stage
☐ Pre-seed

Buttons: [Apply Filters] [Clear All]

Main Content Area:

Header:
"Available Projects" (32px bold)
Sort by: [Best Match ▼] | Filter: [All] [YC Companies] [New Today]
"Showing 24 projects"

Project Card Grid (3 columns desktop, 2 tablet, 1 mobile):

Card Design (320px x 400px):

┌─────────────────────────────────────┐
│ [Logo 48px] [Company Name]    ⭐ YC │
│                                     │
│ [Project Title - 18px bold]         │
│                                     │
│ [Description - 14px, 3 lines max]   │
│ [... Read more]                     │
│                                     │
│ Tech: [React][TS][Supabase]         │
│                                     │
│ 💰 $800-1200  ⏱️ 2-3 weeks         │
│ 📍 Remote                           │
│                                     │
│ Posted 2 days ago • 5 proposals     │
│                                     │
│ [View Details →]                    │
└─────────────────────────────────────┘

Hover Effect:
- Slight elevation (shadow-md → shadow-lg)
- Border color change (Slate-200 → Indigo-300)
- Scale 1.02

Empty State (no matches):
Large icon: 🔍
"No projects match your filters"
"Try adjusting your search criteria or"
[Clear all filters] button

Project Detail Page: /student/projects/[id]

Two-column layout (desktop), stacked (mobile)

Left Column (main content, 60%):

Back link: "← Back to Projects"

Project Title (32px bold)
"Posted by [Company Name] • 3 days ago • [Active]"

Description Section:
[Full markdown-rendered description with formatting]

Requirements Section:
• Requirement 1
• Requirement 2  
• Requirement 3

Deliverables Section:
• Deliverable 1 with acceptance criteria
• Deliverable 2
• Deliverable 3

Tech Stack:
[React][Node.js][MongoDB][AWS][Docker]

Right Column (sidebar, sticky, 40%):

Project Details Card:
Budget: $1,000 - $1,500
Timeline: 3 weeks
Location: Remote
Proposals: 8

[Apply Now →] (primary button, full width)
[Save Project] (outline button, full width)

Divider

About [Company Name]:
[Company logo 64px]
Industry: FinTech
Stage: Seed
Backed by: Y Combinator S24
Team size: 4

[Visit Website →]

Application Modal (triggered by "Apply Now"):

Modal Title: "Apply to [Project Title]"

Form Fields:

Your Proposal *
[Textarea, 500 char minimum]
"Tell the founder why you're a great fit for this project. Mention relevant experience."
Character count: 0/500

Your Rate *
○ Hourly: $ [input] /hr
○ Fixed: $ [input] total

Estimated Timeline *
[input] weeks

Attach Portfolio Projects (optional):
☐ [Project 1 from your portfolio]
☐ [Project 2 from your portfolio]
☐ [Project 3 from your portfolio]

Availability *
[select] "Available immediately" | "Available in 1 week" | "Available in 2 weeks"

Actions:
[Cancel] [Submit Proposal →]

Success message after submit:
"✓ Application submitted successfully!"
"The founder will review your proposal within 48 hours."
[View Your Applications →]

Database Schema:

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL CHECK (LENGTH(cover_letter) >= 500),
  proposed_rate INTEGER,
  rate_type TEXT CHECK (rate_type IN ('hourly', 'fixed')),
  estimated_timeline TEXT,
  attached_projects UUID[] DEFAULT '{}',
  availability TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, student_id)
);

CREATE INDEX idx_proposals_project ON proposals(project_id, status);
CREATE INDEX idx_proposals_student ON proposals(student_id, status);
CREATE INDEX idx_proposals_created ON proposals(created_at DESC);

Success Metrics:
- Click-through rate (card → detail): >40%
- Application completion rate: >60%
- Time to apply: <5 minutes average
- Proposal quality score (founder ratings): >4.0/5
- Match accuracy: >70% of applies result in interview request

Edge Cases:
- Student already applied: Show "Already applied" badge, disable apply button
- Project closed while viewing: Show banner "This project has been filled"
- Student incomplete profile: Prompt to complete voice interview before applying
- Budget out of student's range: Show warning "This budget is outside your stated rate"
- Required skills missing: Flag "You may not meet all requirements. Apply anyway?"

---

### FEATURE 4: STARTUP PROJECT POSTING (PRIORITY 4)

User Story:
"As a startup founder, I want to post a project quickly with clear requirements so I receive quality proposals from qualified students."

Business Value:
PROBLEM SOLVED: Vague project posts lead to mismatched applicants and wasted time
IMPACT: 60% better applicant quality through structured requirements
COMPETITIVE ADVANTAGE: AI suggests optimal project structure based on successful past posts

UI/UX Design:

Page: /startup/projects/new

Page Header:
"Create New Project" (32px bold)
Progress: "Step 1 of 4"

SECTION 1: Basic Information

Project Title *
[Input field, placeholder: "e.g., Build Stripe Integration for SaaS Platform"]
Helper text: "Be specific and descriptive"

Project Description *
[Rich text editor, 200 char minimum]
Toolbar: Bold | Italic | Bullets | Links
Placeholder: "Describe what you need built, why it matters, and what success looks like..."

Project Type *
○ MVP Development
○ Feature Addition
○ Bug Fixing
○ Design Work
○ Other: [input]

SECTION 2: Technical Requirements

Tech Stack * (Select all that apply)
[Multi-select searchable dropdown]
Pre-populated: React | Node.js | Python | TypeScript | MongoDB | PostgreSQL | AWS | Docker | Next.js | Express
[+ Add custom technology]

Required Skills *
[Multi-select dropdown with auto-suggest based on tech stack]
Examples: "REST API development" | "Database design" | "UI/UX implementation"

Deliverables *
Dynamic list where founder can add/remove:
Deliverable 1: [Input] [Remove ✕]
Deliverable 2: [Input] [Remove ✕]
[+ Add deliverable]

Additional Requirements (optional)
[Textarea]
"Any other important details about communication, testing, documentation, etc."

SECTION 3: Timeline & Budget

Timeline *
○ Urgent (< 1 week) - "Need to ship ASAP"
○ Flexible (1-4 weeks) - "Standard timeline"
○ Long-term (1+ months) - "Ongoing project"

Budget *
Budget Range:
Min: $ [input] Max: $ [input]

○ OR Fixed Price: $ [input]

Helper text: "Suggested budget for this type of project: $800-1,500 based on similar posts"

Location
○ Remote (recommended)
○ Hybrid (specify location): [input]
○ On-site (specify location): [input]

SECTION 4: Preview & Publish

Preview Your Listing:
[Live preview card showing exactly how it will appear to students]

Visibility:
○ Public (visible to all verified students) - Recommended
○ Invite-only (only students you invite can see)

Boost Your Post (optional):
☐ Pin to top of results for 7 days (+$50)
☐ Send to top-matched students via email (+$25)

Actions:
[Save as Draft] [← Back] [Post Project →]

After posting, redirect to project detail with success message:
"✓ Project posted successfully!"
"Your project is now live and visible to 500+ verified students."
[View Your Post] [Share Link]

Database Schema:

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (LENGTH(title) >= 10),
  description TEXT NOT NULL CHECK (LENGTH(description) >= 50),
  requirements TEXT,
  deliverables TEXT[],
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  project_type TEXT CHECK (project_type IN ('mvp', 'feature', 'bug_fix', 'design', 'other')),
  budget_min INTEGER,
  budget_max INTEGER,
  fixed_price INTEGER,
  timeline TEXT CHECK (timeline IN ('urgent', 'flexible', 'long_term')),
  location TEXT DEFAULT 'remote',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  proposal_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_budget CHECK (
    (budget_min IS NOT NULL AND budget_max IS NOT NULL AND budget_max >= budget_min) OR
    (fixed_price IS NOT NULL)
  )
);

CREATE INDEX idx_projects_status ON projects(status) WHERE status = 'open';
CREATE INDEX idx_projects_posted_by ON projects(posted_by);
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_projects_tech_stack ON projects USING gin(tech_stack);

Success Metrics:
- Time to complete post: <5 minutes average
- Post completion rate: >85% (start → publish)
- Proposal rate: >8 proposals per project average
- Quality proposal rate: >60% proposals rated as relevant by founder

Edge Cases:
- Founder not verified: Require email verification before posting
- Budget too low: Show warning "This budget may attract fewer applicants"
- Unclear description: AI suggests improvements "Consider adding: expected timeline, testing requirements"
- No deliverables specified: Require at least 1 deliverable
- Draft saved: Auto-save every 30 seconds, allow resume later

---

### FEATURE 5: REAL-TIME MESSAGING (PRIORITY 5)

User Story:
"As both student and founder, I want to communicate in real-time to clarify project details, negotiate terms, and coordinate work."

Business Value:
PROBLEM SOLVED: Email chains are slow; Fiverr messaging is clunky and delayed
IMPACT: 50% faster response times; 30% higher conversion rate
COMPETITIVE ADVANTAGE: Instant communication reduces time-to-hire

Technical Implementation:

Tech Stack:
- Supabase Realtime: WebSocket connections for instant message delivery
- Supabase Database: Messages table with indexes
- React state: Optimistic UI updates

UI/UX Design:

Page: /messages

Two-column layout (desktop), tabbed (mobile)

Left Column: Conversations List (360px)

Header:
"Messages" (24px bold)
[New Message] button (top-right)

Search bar:
[🔍 Search conversations...]

Conversation Item (repeating):
┌────────────────────────────────────┐
│ [Avatar] [Name]            ● 2     │
│          [Last message...]         │
│          2 hours ago               │
└────────────────────────────────────┘

Unread badge: Red circle with count
Online indicator: Green dot next to avatar
Selected state: Indigo-100 background

Sort: Most recent first
Empty state: "No conversations yet"

Right Column: Active Conversation (flex-grow)

Conversation Header (sticky):
[Avatar] [Name] • [Online/Offline]        [⋯ Options]

Options menu:
- View Profile
- Archive Conversation
- Report User

Message Thread (scrollable, reverse chronological):

Other Person's Message (left-aligned):
┌─────────────────────────────────┐
│ [Message text]                  │
│ 2:34 PM                         │
└─────────────────────────────────┘

Your Message (right-aligned, Indigo-600 bg):
                ┌─────────────────────────────────┐
                │ [Message text]                  │
                │ 2:35 PM                    ✓✓  │
                └─────────────────────────────────┘

Checkmarks: ✓ sent, ✓✓ delivered, blue ✓✓ read

Typing Indicator:
"[Name] is typing..."

Message Input (sticky bottom):
[Type your message...]                    [Send →]

Features:
- Shift+Enter for new line
- Enter to send
- Attach file button (image/PDF, max 10MB)
- Auto-resize textarea (max 5 lines)

Real-time Features:

1. INSTANT DELIVERY
- Message appears immediately for sender (optimistic update)
- WebSocket pushes to recipient in <100ms
- Fallback to polling if WebSocket fails

2. READ RECEIPTS
- Mark as read when conversation opened
- Show blue checkmarks to sender
- Update unread count in real-time

3. TYPING INDICATORS
- Broadcast typing status after 500ms of activity
- Clear after 3 seconds of inactivity
- Only show in active conversation

4. ONLINE STATUS
- Green dot if user active in last 5 minutes
- Gray dot if offline
- Update every 30 seconds via heartbeat

Database Schema:

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 5000),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(recipient_id, read) WHERE read = FALSE;

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID NOT NULL REFERENCES profiles(id),
  participant_2 UUID NOT NULL REFERENCES profiles(id),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_1, participant_2),
  CHECK (participant_1 < participant_2) -- Ensure consistent ordering
);

CREATE INDEX idx_conversations_participant ON conversations(participant_1, last_message_at DESC);

Success Metrics:
- Message delivery time: <500ms average
- Uptime: >99.5%
- Unread response rate: >80% within 24 hours
- User satisfaction with messaging: >4.2/5

Edge Cases:
- Recipient blocked sender: Show "Unable to send" error
- Network disconnection: Queue messages locally, retry on reconnect
- Very long message: Show character count, limit to 5000 chars
- Spam detection: Rate limit to 10 messages per minute
- Offline recipient: Store and deliver when they return online
- Conversation with deleted user: Show "[User deleted]" placeholder

---

### FEATURE 6: USER DASHBOARDS (PRIORITY 6)

STUDENT DASHBOARD: /student/dashboard

Purpose: Central hub for students to track applications, active projects, and earnings

Layout:

Header Section:
"Welcome back, [Name]! 👋" (32px)

Profile Completion Progress:
[████████░░ 85%]
"Complete your portfolio to get more matches →"

Metrics Row (3 cards, responsive grid):

Card 1:
Active Projects
[2]
(large number, 48px)

Card 2:
Total Applications
[8]

Card 3:
Earnings This Month
[$2,400]

Recent Activity Feed:

Section Title: "Recent Activity"

Activity Item Types:

1. New Project Match:
┌────────────────────────────────────┐
│ 🎯 New project match:              │
│ "Build AI Chatbot for SaaS"       │
│ 92% match • Posted 1 hour ago     │
│ [View Project →]                   │
└────────────────────────────────────┘

2. Message Received:
┌────────────────────────────────────┐
│ 💬 New message from Acme Corp      │
│ "We'd like to discuss your..."    │
│ [View Message →]                   │
└────────────────────────────────────┘

3. Project Completed:
┌────────────────────────────────────┐
│ ✅ Project completed:              │
│ "E-commerce Dashboard"             │
│ $800 • 5⭐ review received         │
│ [View Details →]                   │
└────────────────────────────────────┘

4. Application Status:
┌────────────────────────────────────┐
│ 📨 Application update:             │
│ "React Developer" - Under Review   │
│ Founder viewed 2 hours ago         │
│ [View Status →]                    │
└────────────────────────────────────┘

Active Projects Section:

"Your Active Projects" (24px bold)

Project Card:
┌────────────────────────────────────┐
│ [Project Name]        [In Progress]│
│ Client: [Company Name]             │
│ Deadline: 5 days                   │
│ Progress: ████████░░ 75%           │
│ [View Project] [Message Client]    │
└────────────────────────────────────┘

Empty state:
"No active projects yet"
"Browse available projects to get started"
[Browse Projects →]

STARTUP DASHBOARD: /startup/dashboard

Purpose: Central hub for founders to manage posted projects and review proposals

Header Section:
"Welcome back, [Name]! 👋"

Quick Stats (3 cards):
- Active Projects: 3
- Pending Proposals: 12
- Budget Spent This Month: $4,200

Quick Actions Row:
[Post New Project] [Browse Builders] [Messages (2 new)]

Posted Projects Section:

"Your Posted Projects"

Project Card:
┌────────────────────────────────────┐
│ [Project Title]          [Active]  │
│ Posted 5 days ago • 12 proposals   │
│                                    │
│ Top Proposals:                     │
│ • [Student 1] - $850 • ⭐ 4.9     │
│ • [Student 2] - $920 • ⭐ 5.0     │
│ • [Student 3] - $780 • ⭐ 4.7     │
│                                    │
│ [Review Proposals] [Edit] [Close]  │
└────────────────────────────────────┘

Recent Activity Feed:

Activity Types:
- New proposal received
- Student accepted offer
- Project milestone completed
- Payment processed
- Review received

---

## NON-FUNCTIONAL REQUIREMENTS

### Performance

Response Times:
- API endpoints: <200ms p95
- Voice processing: <15 seconds from finish to portfolio
- Semantic search: <5 seconds for top matches
- Page load: <2 seconds on 4G connection
- Message delivery: <500ms

Scalability:
- Support 10,000 concurrent users
- Handle 1,000 voice interviews per hour
- Process 100,000 semantic searches per day
- Store 1M+ messages with fast retrieval

### Security

Authentication:
- Supabase Auth with email/password
- Optional Google/GitHub OAuth
- Multi-factor authentication (future)
- Session timeout after 30 days inactivity

Authorization:
- Row-level security (RLS) on all tables
- Students can only see/edit their own data
- Founders can only access their own projects
- Admin role for platform management

Data Protection:
- All data encrypted at rest (AES-256)
- TLS 1.3 for data in transit
- Voice transcripts encrypted separately
- GDPR/CCPA compliant data handling
- User can delete all data on request

API Security:
- Rate limiting: 100 requests per minute per user
- API key rotation every 90 days
- No service keys exposed client-side
- CORS restricted to platform domain

### Reliability

Uptime:
- 99.9% availability SLA
- Maximum 43 minutes downtime per month
- Planned maintenance during off-peak hours

Backup:
- Daily automated Supabase backups
- 30-day retention period
- Point-in-time recovery available
- Multi-region failover (future)

Error Handling:
- Graceful degradation if AI APIs fail
- User-friendly error messages
- Automatic retry with exponential backoff
- Error logging to Sentry

Monitoring:
- Real-time error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (Better Uptime)
- Daily health checks

### Accessibility

WCAG 2.1 AA Compliance:
- Semantic HTML throughout
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators visible
- Color contrast ratio >4.5:1
- Alt text for all images
- Screen reader tested

Mobile Support:
- Responsive design (mobile-first)
- Touch targets >44x44px
- Optimized for iOS Safari and Chrome Android
- Progressive Web App (PWA) capabilities

---

## TECHNICAL ARCHITECTURE

### System Architecture

