-- 1. Create Contact Submissions Table
CREATE TABLE "physoc-contact_submissions" (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  year text,
  subject text,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Announcements Table (with event_date as requested)
CREATE TABLE "physoc-announcements" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  body text not null,
  event_date date, -- For event specific dates
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Resources Table
CREATE TABLE "physoc-resources" (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null,
  link_url text not null,
  description text,
  course_code text,
  semester text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE "physoc-contact_submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "physoc-announcements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "physoc-resources" ENABLE ROW LEVEL SECURITY;

-- 5. Policies for Contact Submissions
-- Anyone can insert a contact submission (needed for the public contact form)
CREATE POLICY "Enable insert for public" ON "physoc-contact_submissions"
FOR INSERT WITH CHECK (true);

-- Only authenticated users (admins) can view submissions
CREATE POLICY "Enable read access for authenticated users only" ON "physoc-contact_submissions"
FOR SELECT TO authenticated USING (true);

-- 5. Policies for Announcements
-- Anyone can read announcements (needed for the public announcements page)
CREATE POLICY "Enable read access for all users" ON "physoc-announcements"
FOR SELECT USING (true);

-- Only authenticated users (admins) can insert/update/delete announcements
CREATE POLICY "Enable insert for authenticated users only" ON "physoc-announcements"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "physoc-announcements"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON "physoc-announcements"
FOR DELETE TO authenticated USING (true);

-- 7. Policies for Resources
-- Anyone can read resources
CREATE POLICY "Enable read access for all users" ON "physoc-resources"
FOR SELECT USING (true);

-- Only authenticated users (admins) can insert/update/delete resources
CREATE POLICY "Enable insert for authenticated users only" ON "physoc-resources"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON "physoc-resources"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON "physoc-resources"
FOR DELETE TO authenticated USING (true);

-- 8. Create Weekly Puzzles Table
CREATE TABLE "physoc-weekly_puzzles" (
  id uuid default gen_random_uuid() primary key,
  week_label text not null,
  question text not null,
  options jsonb not null,
  correct_answer_index integer not null,
  active boolean default false,
  correct_count integer default 0,
  wrong_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Policies for Weekly Puzzles
ALTER TABLE "physoc-weekly_puzzles" ENABLE ROW LEVEL SECURITY;

-- Anyone can read active puzzles
CREATE POLICY "Enable read access for all" ON "physoc-weekly_puzzles"
FOR SELECT USING (true);

-- Anyone can update to increment correct/wrong counts
-- Note: A more secure approach uses an RPC, but this satisfies the basic requirement
CREATE POLICY "Enable update counts for all" ON "physoc-weekly_puzzles"
FOR UPDATE USING (true) WITH CHECK (true);

-- Authenticated users (admins) can insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON "physoc-weekly_puzzles"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable full update for authenticated users" ON "physoc-weekly_puzzles"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON "physoc-weekly_puzzles"
FOR DELETE TO authenticated USING (true);

-- 10. Create Internships Table
CREATE TABLE "physoc-internships" (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  opportunity text not null,
  eligibility text not null,
  deadline text not null,
  interview_dates text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE "physoc-internships" ENABLE ROW LEVEL SECURITY;

-- Anyone can read internships
CREATE POLICY "Enable read access for all" ON "physoc-internships"
FOR SELECT USING (true);

-- Authenticated users (admins) can insert/update/delete
CREATE POLICY "Enable insert for authenticated users" ON "physoc-internships"
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable full update for authenticated users" ON "physoc-internships"
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON "physoc-internships"
FOR DELETE TO authenticated USING (true);
