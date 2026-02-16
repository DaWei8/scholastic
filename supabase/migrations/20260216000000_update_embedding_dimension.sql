-- Migration: Update embedding dimensions from 768 (text-embedding-004) to 3072 (gemini-embedding-001)
-- The text-embedding-004 model was deprecated on Jan 14, 2026.
-- The replacement model gemini-embedding-001 outputs 3072-dimensional vectors.

-- Step 1: Clear existing embeddings (they are incompatible with the new dimension)
UPDATE public.profiles SET embedding = NULL;
UPDATE public.faculty SET embedding = NULL;

-- Step 2: Alter column types to new dimension
ALTER TABLE public.profiles ALTER COLUMN embedding TYPE vector(3072);
ALTER TABLE public.faculty ALTER COLUMN embedding TYPE vector(3072);

-- Step 3: Recreate the match_faculty function with updated vector dimension
CREATE OR REPLACE FUNCTION match_faculty (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  name text,
  institution text,
  bio_summary text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    faculty.id,
    faculty.name,
    faculty.institution,
    faculty.bio_summary,
    1 - (faculty.embedding <=> query_embedding) AS similarity
  FROM faculty
  WHERE 1 - (faculty.embedding <=> query_embedding) > match_threshold
  ORDER BY faculty.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
