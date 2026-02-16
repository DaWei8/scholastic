-- ENABLE EXTENSIONS
create extension if not exists vector;

-- TABLES
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  field_of_study text,
  resume_url text,
  resume_text text,
  embedding vector(768), -- Optimized for Gemini 'text-embedding-004'
  updated_at timestamp with time zone default now()
);

create table public.faculty (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  institution text not null,
  department text,
  email text,
  bio_summary text,
  research_interests text[],
  embedding vector(768),
  website_url text,
  image_url text,
  is_accepting_students boolean default true,
  created_at timestamp with time zone default now()
);

create table public.interactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  faculty_id uuid references public.faculty on delete cascade,
  status text check (status in ('shortlisted', 'rejected', 'pending')),
  relevance_score float,
  match_explanation text,
  created_at timestamp with time zone default now(),
  unique(user_id, faculty_id)
);

create table public.outreach_logs (
  id uuid default gen_random_uuid() primary key,
  interaction_id uuid references public.interactions(id) on delete cascade,
  email_body text,
  status text check (status in ('draft', 'sent', 'replied')) default 'draft',
  sent_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- SEMANTIC SEARCH FUNCTION
create or replace function match_faculty (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  institution text,
  bio_summary text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    faculty.id,
    faculty.name,
    faculty.institution,
    faculty.bio_summary,
    1 - (faculty.embedding <=> query_embedding) as similarity
  from faculty
  where 1 - (faculty.embedding <=> query_embedding) > match_threshold
  order by faculty.embedding <=> query_embedding
  limit match_count;
end;
$$;
